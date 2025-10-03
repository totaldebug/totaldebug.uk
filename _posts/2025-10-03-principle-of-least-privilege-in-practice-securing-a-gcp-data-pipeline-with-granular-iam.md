--- 
title: "Principle of Least Privilege in Practice: Securing a GCP Data Pipeline with Granular IAM" 
date: "2025-10-03" 
draft: true 
--- 

# Principle of Least Privilege in Practice: Securing a GCP Data Pipeline with Granular IAM

We've all heard the advice: apply the **Principle of Least Privilege (PoLP)**. It's a foundational concept in cybersecurity, dictating that any user, program, or process should have only the bare minimum permissions necessary to perform its function. In theory, it's simple. In practice, especially in a complex cloud environment like Google Cloud Platform (GCP), it can be a daunting task.

Generic advice like "don't use primitive roles" is a good start, but it doesn't help you when you're staring at a real-world application with multiple interconnected services. How do you determine what "least privilege" actually looks like?

This post is for the DevOps and Security Engineers who want to move beyond the theory. I'm going to walk you through a practical, code-based example of how to implement PoLP for a serverless IoT data pipeline on GCP. We'll use Terraform to define our infrastructure and craft precise, granular IAM policies for every component, ensuring they have *only* the permissions they absolutely need.

## The Scenario: A Serverless IoT Data Pipeline

To make this concrete, let's imagine a simple but common use case. We have a fleet of IoT devices sending telemetry data. Our goal is to ingest this data, process it, and store it for later analysis.

Our architecture is fully serverless and consists of three core components:

*   **Pub/Sub Topic:** A topic named `iot-telemetry-topic` acts as the ingestion point for raw data from our devices.
*   **Cloud Function:** A function named `process-telemetry-function` is triggered by new messages on the Pub/Sub topic. It performs some lightweight processing (e.g., parsing JSON, adding a timestamp) on the data.
*   **Cloud Storage Bucket:** A bucket named `iot-processed-data-bucket` is our final destination, where the processed data is stored as individual objects.

Here’s a high-level look at how these pieces fit together:

{% include post-picture.html img="gcp-pipeline-architecture.png" alt="Architecture diagram of the IoT data pipeline showing Pub/Sub, a Cloud Function, and a Cloud Storage bucket." h="400" w="800" shadow="true" align="true" %}

Our mission is to secure this pipeline by creating a dedicated **Service Account** for our Cloud Function and meticulously assigning it only the permissions required to do its job.

## The Anti-Pattern: Overly Broad Permissions

Before we build the right solution, it's crucial to understand the wrong one. When I'm auditing a GCP project, the most common mistake I see is the use of broad, project-level IAM roles.

Consider this Terraform snippet:

```hcl
resource "google_service_account" "bad_service_account" {
  account_id   = "iot-pipeline-sa-bad"
  display_name = "A very insecure Service Account"
}

resource "google_project_iam_member" "bad_iam_binding" {
  project = "your-gcp-project-id"
  role    = "roles/editor"
  member  = "serviceAccount:${google_service_account.bad_service_account.email}"
}
```

This code grants the `bad_service_account` the primitive **Editor** (`roles/editor`) role on the *entire project*.

> ### Why is this so bad?
> The **Editor** role grants permissions to create, modify, and delete most Google Cloud resources. If the credentials for this service account were ever compromised, an attacker could potentially delete your databases, stop your VMs, and access sensitive data across the entire project. The blast radius is enormous.
{: .prompt-danger }

Our goal is to shrink that blast radius to the absolute minimum. Let's start over and do it right.

## Step 1: Creating a Dedicated Service Account

The first rule of applying PoLP to applications is: **one application, one identity**. We'll create a new, dedicated Service Account specifically for our `process-telemetry-function`.

```hcl
# In main.tf

resource "google_service_account" "telemetry_processor_sa" {
  project      = var.project_id
  account_id   = "telemetry-processor-sa"
  display_name = "Service Account for the IoT Telemetry Processor Function"
}
```

When this Service Account is created, it has **zero permissions**. It can't read anything, write anything, or do anything at all. This is our clean slate.

## Step 2: Granting Execution and Trigger Permissions

Our Cloud Function needs two types of permissions to operate:

1.  **Trigger Permission:** Something needs to be allowed to *invoke* the function. In our case, that's the Google-managed Pub/Sub service.
2.  **Execution Permissions:** The Service Account *used by the function* needs permission to perform its tasks (i.e., read from Pub/Sub and write to Cloud Storage).

Let's define our function and its trigger first. We'll associate it with the Service Account we just created.

```hcl
# In main.tf, continued...

# 1. The Cloud Storage bucket for our function's source code
resource "google_storage_bucket" "function_source_bucket" {
  project      = var.project_id
  name         = "${var.project_id}-function-source"
  location     = "US-CENTRAL1"
  uniform_bucket_level_access = true
}

# (Assume function source code is in a 'source' directory and zipped)
data "archive_file" "source_zip" {
  type        = "zip"
  source_dir  = "source"
  output_path = "/tmp/source.zip"
}

resource "google_storage_bucket_object" "source_object" {
  name   = "source.zip"
  bucket = google_storage_bucket.function_source_bucket.name
  source = data.archive_file.source_zip.output_path
}

# 2. The Pub/Sub topic that triggers the function
resource "google_pubsub_topic" "iot_telemetry" {
  project = var.project_id
  name    = "iot-telemetry-topic"
}

# 3. The Cloud Function itself
resource "google_cloudfunctions2_function" "process_telemetry" {
  project  = var.project_id
  name     = "process-telemetry-function"
  location = "us-central1"

  build_config {
    runtime     = "nodejs18"
    entry_point = "handler" # The name of the exported function in your code
    source {
      storage_source {
        bucket = google_storage_bucket.function_source_bucket.name
        object = google_storage_bucket_object.source_object.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    min_instance_count = 0
    available_memory   = "256Mi"
    timeout_seconds    = 60
    # Here's the key part: associating our dedicated SA
    service_account_email = google_service_account.telemetry_processor_sa.email
    
    event_trigger {
      trigger_region = "us-central1"
      event_type     = "google.cloud.pubsub.topic.v1.messagePublished"
      pubsub_topic   = google_pubsub_topic.iot_telemetry.id
    }
  }
}
```

Now, we need to allow Pub/Sub to invoke this function. We do this by granting the `roles/run.invoker` role to a special **Google-managed service account** known as the Pub/Sub Service Agent.

```hcl
# Grant Pub/Sub permission to invoke the Cloud Function
resource "google_cloud_run_service_iam_member" "pubsub_invoker" {
  location = google_cloudfunctions2_function.process_telemetry.location
  service  = google_cloudfunctions2_function.process_telemetry.name
  project  = google_cloudfunctions2_function.project
  
  role   = "roles/run.invoker"
  # This special member identity is the Pub/Sub service agent
  member = "serviceAccount:service-${data.google_project.project.number}@gcp-sa-pubsub.iam.gserviceaccount.com"
}

# We need the project number to construct the service agent email
data "google_project" "project" {}
```

> ### What's a Service Agent?
> A Service Agent is a Google-managed service account that acts on behalf of a Google service. When you enable an API like Pub/Sub, GCP creates a service agent for it. To allow Pub/Sub to interact with other resources (like invoking a Cloud Function), you grant permissions to this agent.
{: .prompt-info }

With this in place, Pub/Sub can now successfully trigger our function. But the function itself still can't do anything useful.

## Step 3: Granting Granular Execution Permissions

Our function's code needs to perform two specific actions:
1.  Pull messages from the Pub/Sub subscription created by the Eventarc trigger.
2.  Create new objects in the `iot-processed-data-bucket`.

We will grant these permissions directly on the resources in question, not on the project.

First, let's create the destination storage bucket:

```hcl
resource "google_storage_bucket" "processed_data" {
  project      = var.project_id
  name         = "${var.project_id}-iot-processed-data"
  location     = "US-CENTRAL1"
  uniform_bucket_level_access = true
}
```

Now, we'll create two distinct IAM bindings for our Service Account:

```hcl
# 1. Allow the function's SA to create objects in our specific bucket
resource "google_storage_bucket_iam_member" "allow_object_create" {
  bucket = google_storage_bucket.processed_data.name
  role   = "roles/storage.objectCreator"
  member = "serviceAccount:${google_service_account.telemetry_processor_sa.email}"
}

# 2. Allow the function's SA to consume messages from its specific Pub/Sub subscription
# The Eventarc trigger creates a subscription automatically. We need to grant access to it.
# The subscription ID is predictable based on the trigger name.
resource "google_pubsub_subscription_iam_member" "allow_pubsub_consume" {
  project      = var.project_id
  # The Eventarc trigger creates a subscription with a predictable name format
  subscription = "events-projects-${var.project_id}-locations-${google_cloudfunctions2_function.process_telemetry.location}-triggers-${google_cloudfunctions2_function.process_telemetry.name}"
  role         = "roles/pubsub.subscriber"
  member       = "serviceAccount:${google_service_account.telemetry_processor_sa.email}"
}
```
Look at what we've done here. Instead of a project-wide `roles/editor`, our Service Account has:
*   `roles/storage.objectCreator` **only** on the `iot-processed-data-bucket`. It cannot read or delete objects, nor can it interact with any other bucket in the project.
*   `roles/pubsub.subscriber` **only** on the specific subscription for our function. It cannot publish to the topic or even see other subscriptions.

This is the **Principle of Least Privilege** in action. The blast radius is now tiny. If these credentials were compromised, the damage an attacker could do is limited to creating junk files in one bucket and re-reading a few Pub/Sub messages.

## Going a Step Further: IAM Conditions

For some resources, we can get even more granular by using **IAM Conditions**. These are expressions written in Common Expression Language (CEL) that can check attributes of the request, like the destination resource name or the time of day.

Let's say our function should only ever write JSON files to the storage bucket. We can enforce this with a condition.

We'll change our `google_storage_bucket_iam_member` to a `google_storage_bucket_iam_binding` and add a `condition` block.

```hcl
# Replacing the previous storage IAM resource with a conditional one

resource "google_storage_bucket_iam_binding" "allow_json_object_create" {
  bucket = google_storage_bucket.processed_data.name
  role   = "roles/storage.objectCreator"
  members = [
    "serviceAccount:${google_service_account.telemetry_processor_sa.email}",
  ]

  condition {
    title       = "allow_only_json_files"
    expression  = "resource.name.endsWith('.json')"
    description = "Only allows creation of objects with a .json suffix"
  }
}
```

> ### A Powerful Security Layer
> With this condition in place, even if the function's code had a bug or was compromised to try and write a `.txt` file or a malicious executable, the IAM policy at the GCP level would block the request. This provides an excellent defense-in-depth security control.
{: .prompt-tip }

## Final Thoughts

Let's recap the key principles we've applied:

1.  **Dedicated Identities:** We created a specific Service Account for a single component of our application.
2.  **Resource-Level Permissions:** We attached IAM policies directly to the resources (`google_storage_bucket_iam_member`, `google_pubsub_subscription_iam_member`) instead of the project.
3.  **Scoped Roles:** We used fine-grained, predefined roles like `roles/storage.objectCreator` and `roles/pubsub.subscriber` instead of overly permissive primitive roles.
4.  **Conditional Access:** We used an IAM Condition to further restrict permissions based on the attributes of the resource being created.

Yes, this approach requires more lines of code and a bit more thought than just slapping `roles/editor` on a project. But the security benefits are immense. You've created a system that is resilient by design, where the potential impact of any single component's compromise is strictly contained.

I encourage you to take a look at the Service Accounts in your own GCP projects. Are they using dedicated identities? Are their permissions scoped as tightly as possible? Taking the time to refactor your IAM policies using these principles isn't just a security best practice—it's essential for building robust and trustworthy systems in the cloud.

If you have any questions or want to share your own IAM strategies, drop a comment below or join us on our [Discord server](https://discord.gg/your-invite-link)