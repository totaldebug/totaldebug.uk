--- title: "Principle of Least Privilege in Practice: Securing a GCP Data Pipeline with Granular IAM" date: "2025-10-02" draft: true ---  # Principle of Least Privilege in Practice: Securing a GCP Data Pipeline with Granular IAM

The **Principle of Least Privilege (PoLP)** is one of those foundational cybersecurity concepts we all nod our heads to. "Yes, of course, a service should only have the permissions it absolutely needs." But when the pressure is on to ship a feature, it's dangerously easy to reach for a broad, permissive IAM role like `roles/editor` and promise yourself you'll "fix it later."

Generic IAM advice is easy to find, but the real challenge is applying it to a complex, real-world application. That's where theory meets the messy reality of interconnected services.

This post is for the DevOps and Security Engineers who want to move beyond the theory. I'm going to walk you through a practical, code-based example of how to properly secure a serverless IoT data pipeline on Google Cloud Platform. We will craft precise, granular IAM policies for Service Accounts, Cloud Storage buckets, and Eventarc triggers, ensuring every component is locked down and has only the permissions required to do its job.

## The Problem with "Good Enough" IAM

In the early stages of a project, a developer might be assigned the `Editor` role on a GCP project. This is great for rapid prototyping. They can spin up databases, create functions, and configure storage without hitting any permissions roadblocks.

The problem arises when we apply this same logic to our applications. A Cloud Function doesn't need project-wide `Editor` permissions to write a file to a single Cloud Storage bucket. Granting it such broad access is like giving a hotel key card that opens every single room, not just the one you're staying in. If that key card (the service account key) is compromised, the attacker has free rein over your entire project.

Our goal is to create key cards that only open one specific door.

## Our Example: A Serverless IoT Data Pipeline

To make this practical, let's define the architecture we'll be securing. It's a simple, common pattern for ingesting and storing data from distributed devices.

{% include post-picture.html img="gcp-least-privilege-pipeline.png" alt="Architecture diagram of a serverless IoT data pipeline on GCP" h="450" w="800" shadow="true" align="true" %}

1.  **Pub/Sub Topic:** IoT devices publish their sensor readings to a central Pub/Sub topic named `iot-telemetry`.
2.  **Eventarc Trigger:** An Eventarc trigger is subscribed to the `iot-telemetry` topic. When a new message arrives, the trigger fires.
3.  **Cloud Function (2nd Gen):** The trigger invokes a Cloud Function. This function performs some light data processing or validation.
4.  **Cloud Storage Bucket:** The function then writes the processed data as a new object into a specific Cloud Storage bucket named `processed-iot-data-bucket`.

Every arrow in that diagram represents a potential IAM interaction that we need to define and restrict. Let's build it out using Terraform, the standard for **Infrastructure as Code (IaC)**.

## Step 1: Create a Dedicated Service Account (The "Who")

First, our Cloud Function needs an identity. We should *never* use the default compute service account for specific applications. Instead, we'll create a new, dedicated **Service Account**. This gives our function a unique identity that we can assign permissions to.

> **What is a Service Account?**
> A service account is a special type of Google account intended to represent a non-human user that needs to authenticate and be authorized to access data in Google APIs. It's the identity of your application or VM.
{: .prompt-info }

Here's the Terraform code to create our service account:

```hcl
# main.tf

resource "google_service_account" "iot_processor_sa" {
  project      = "your-gcp-project-id"
  account_id   = "iot-data-processor"
  display_name = "Service Account for IoT Data Processing Function"
  description  = "Identity for the Cloud Function that processes and stores IoT telemetry."
}
```

By creating `iot-data-processor`, we now have a specific principal to grant permissions to. If this service account were ever compromised, we would know exactly which application was affected, and the blast radius would be limited to only the permissions we explicitly grant it in the next steps.

## Step 2: Grant Granular Storage Permissions (The "What" and "Where")

Our Cloud Function needs to write data to the `processed-iot-data-bucket`. A common mistake is to grant storage permissions at the project level.

**The wrong way:**

```hcl
# AVOID THIS - TOO PERMISSIVE

resource "google_project_iam_member" "bad_storage_permission" {
  project = "your-gcp-project-id"
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.iot_processor_sa.email}"
}
```

This `google_project_iam_member` resource tells GCP: "Give this service account the ability to manage objects in **every single bucket** in this project." This is a huge security risk.

**The right way:**

We should use a resource-specific IAM binding. The `google_storage_bucket_iam_binding` resource applies a role to a **single bucket**, not the entire project.

```hcl
# terraform/storage.tf

resource "google_storage_bucket" "processed_data_bucket" {
  project      = "your-gcp-project-id"
  name         = "processed-iot-data-bucket"
  location     = "US-CENTRAL1"
  uniform_bucket_level_access = true
}

# THIS IS CORRECT - SCOPED TO A SINGLE RESOURCE
resource "google_storage_bucket_iam_binding" "allow_function_to_write" {
  bucket = google_storage_bucket.processed_data_bucket.name
  role   = "roles/storage.objectCreator"
  
  members = [
    "serviceAccount:${google_service_account.iot_processor_sa.email}",
  ]
}
```

Let's break down why this is so much better:
*   **Resource-Specific:** The permission only applies to `processed-iot-data-bucket`. If our service account credentials leak, the attacker can't touch any other buckets.
*   **Least Privilege Role:** We're using `roles/storage.objectCreator`. This role allows the service account to *create* new objects, but it **cannot** read, delete, or overwrite existing ones. This is a perfect example of giving the service *only* the permission it needs to fulfill its function. We chose it over `roles/storage.objectUser` (can read) or `roles/storage.objectAdmin` (can delete and overwrite).

## Step 3: Securing the Eventarc Trigger

The Eventarc trigger is the glue between Pub/Sub and our Cloud Function. It also needs a carefully scoped set of permissions to function correctly.

When you enable the Eventarc API, Google creates a special service account for it called the **Eventarc service agent**. This service agent needs permission to invoke your Cloud Function.

```hcl
# terraform/function.tf

resource "google_cloudfunctions2_function" "iot_processor_function" {
  project  = "your-gcp-project-id"
  name     = "iot-processor-function"
  location = "us-central1"

  build_config {
    runtime     = "nodejs18"
    entry_point = "processTelemetry"
    source {
      storage_source {
        bucket = "your-source-code-bucket"
        object = "source.zip"
      }
    }
  }

  service_config {
    # Attach the dedicated service account from Step 1
    service_account_email = google_service_account.iot_processor_sa.email
    ingress_settings      = "ALLOW_INTERNAL_ONLY"
  }
}

# Allow the Eventarc service agent to invoke our specific function
resource "google_cloudfunctions2_function_iam_member" "eventarc_invoker" {
  project        = google_cloudfunctions2_function.iot_processor_function.project
  location       = google_cloudfunctions2_function.iot_processor_function.location
  cloud_function = google_cloudfunctions2_function.iot_processor_function.name

  role   = "roles/run.invoker"
  # This member is the Eventarc service agent for your project
  member = "serviceAccount:service-${data.google_project.project.number}@gcp-sa-eventarc.iam.gserviceaccount.com"
}

# Helper to get the project number
data "google_project" "project" {}
```

Here, we're using `google_cloudfunctions2_function_iam_member` to grant the `roles/run.invoker` role to Eventarc's service agent, but *only for this one function*. This prevents the trigger from being able to invoke any other functions or Cloud Run services in the project.

> **Finding the Service Agent Email**
> Google-managed service accounts follow a predictable pattern. For Eventarc, it's `service-<PROJECT_NUMBER>@gcp-sa-eventarc.iam.gserviceaccount.com`. You can use the `gcloud projects describe` command or a Terraform data source, as shown above, to get your project number.
{: .prompt-tip }

Finally, we can define the trigger itself, which ties everything together.

```hcl
# terraform/eventarc.tf

resource "google_pubsub_topic" "iot_telemetry" {
  project = "your-gcp-project-id"
  name    = "iot-telemetry"
}

resource "google_eventarc_trigger" "iot_trigger" {
  project  = "your-gcp-project-id"
  name     = "iot-telemetry-trigger"
  location = "us-central1"

  matching_criteria {
    attribute = "type"
    value     = "google.cloud.pubsub.topic.v1.messagePublished"
  }

  destination {
    cloud_function = google_cloudfunctions2_function.iot_processor_function.id
  }

  transport {
    pubsub {
      topic = google_pubsub_topic.iot_telemetry.id
    }
  }

  # This is crucial - Eventarc uses this service account to manage the Pub/Sub subscription
  service_account = "service-${data.google_project.project.number}@gcp-sa-eventarc.iam.gserviceaccount.com"
}
```

## Final Thoughts: A Blueprint for Secure Applications

Let's review what we've accomplished. By moving away from broad, project-level roles and focusing on resource-specific bindings, we have built a much more secure and resilient system.

*   **Cloud Function (`iot_processor_sa`):** Can only create objects in one specific Cloud Storage bucket. It cannot read them, delete them, or access any other GCP service.
*   **Eventarc Trigger (Service Agent):** Can only invoke one specific Cloud Function in response to messages from one specific Pub/Sub topic.
*   **Blast Radius Reduction:** If any single component's credentials were to be compromised, the damage is strictly contained. An attacker with the function's identity can't read sensitive data from another bucket or spin up a fleet of crypto-mining VMs.

This process of applying the **Principle of Least Privilege** is not a one-time setup. It's a continuous practice. As your application evolves, you'll need to revisit its permissions. I highly recommend using tools like the [GCP IAM Recommender](https://cloud.google.com/iam/docs/recommender-overview), which can analyze usage logs and suggest tightening overly permissive roles.

Implementing granular IAM takes more effort upfront than slapping an `Editor` role on everything, but the long-term security and stability benefits are immeasurable. It's the difference between building a house with a single master key and one where every door has its own unique lock.

What are your biggest IAM challenges on GCP? Have you found any useful tricks for discovering the minimum required permissions for a service? I'd love to hear about them in the comments below or in the [Total Debug Discord server](https://totaldebug.uk/discord)