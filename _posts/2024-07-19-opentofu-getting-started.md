---
title: "Getting Started with OpenTofu: Infrastructure as Code for Cloud Providers"
date: 2024-07-19 10:14:35 +0100
image:
  path: assets/img/posts/opentofu-getting-started/thumb.png
categories: [Automation]
tags: [opentofu, iac]
pin: false
toc: true
comments: true
---

In August 2023, the infrastructure-as-code community was sent into a frenzy when HashiCorp announced that Terraform would be shifting to a Business Source License (BSL). This move sparked widespread concern among developers and DevOps professionals who had grown accustomed to the open-source nature of Terraform. However, in the face of this change, a remarkable opportunity arose: the chance to create an open-source alternative that would preserve the spirit of collaboration and innovation that Terraform had embodied.

Thus, OpenTofu was born – a community-driven fork of Terraform that has rapidly evolved into a powerful, production-ready tool. With its commitment to openness and transparency, OpenTofu has become a beacon of hope for those seeking a truly open-source IaC solution. In this article, we'll delve into the world of OpenTofu, exploring its features, benefits, and the exciting possibilities it holds for the DevOps community.

## What is OpenTofu?

OpenTofu, formerly known as OpenTF, is an open-source infrastructure-as-code (IaC) tool that originated from a fork of Terraform. In August 2023, HashiCorp announced its decision to move Terraform under the Business Source License (BSL), which means that while the code would remain available for free use, it would no longer be open source in the classical sense.

In response to this change, a community-driven effort was initiated to create an open-source alternative that would maintain the spirit of transparency and collaboration that Terraform had embodied. OpenTofu was born, with the goal of providing a similar set of features and capabilities as Terraform while ensuring that it remains truly open source.

As an IaC tool, OpenTofu allows users to define and manage infrastructure resources, such as cloud instances, databases, and networks, using a human-readable configuration file. This approach enables developers, DevOps engineers, and IT professionals to version control and track changes to their infrastructure, making it easier to manage complex systems and collaborate with teams.

By choosing OpenTofu, users can ensure that they have full control over the codebase, free from the restrictions imposed by proprietary licenses. This flexibility is particularly important for organisations that rely heavily on open-source solutions or have specific requirements for customisation and extensibility.

In the following sections, we'll dive deeper into the features and benefits of OpenTofu, as well as provide guidance on how to get started with this exciting new project.

## Why OpenTofu?

Well OpenTofu ensures that a core IaC tool remains open-source. Not only does this mean you get all the
benefits of open-source but it ensures that future enhancements are driven by the community.

OpenTofu is currently backwards compatible with Terraform, meaning that companies who currently use
Terraform with deep integration can easily transition without any disruption to existing workflows.
This compatibility coupled with  the long list of [organisations supporting](https://opentofu.org/supporters/)
OpenTofu places the tool as a potential open standard for DevOps and IaC.

## Installing OpenTofu

Here are instructions to install OpenTofu on some popular Operating Systems:

### Linux via Snap

```bash
snap install --classic opentofu
```

### Ubuntu / Debian

First you must install some tooling required for adding the repositories:

```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
```


Now you need a copy of the OpenTofu GPG Key:

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://get.opentofu.org/opentofu.gpg | sudo tee /etc/apt/keyrings/opentofu.gpg >/dev/null
curl -fsSL https://packages.opentofu.org/opentofu/tofu/gpgkey | sudo gpg --no-tty --batch --dearmor -o /etc/apt/keyrings/opentofu-repo.gpg >/dev/null
sudo chmod a+r /etc/apt/keyrings/opentofu.gpg
```

Once you have the GPG Key, you can create the OpenTofu source:

```bash
echo \
  "deb [signed-by=/etc/apt/keyrings/opentofu.gpg,/etc/apt/keyrings/opentofu-repo.gpg] https://packages.opentofu.org/opentofu/tofu/any/ any main
deb-src [signed-by=/etc/apt/keyrings/opentofu.gpg,/etc/apt/keyrings/opentofu-repo.gpg] https://packages.opentofu.org/opentofu/tofu/any/ any main" | \
  sudo tee /etc/apt/sources.list.d/opentofu.list > /dev/null
```

Finally install OpenTofu:

```bash
sudo apt-get update
sudo apt-get install -y tofu
```

### RHEL / Suse / Fedora

Create the opentofu repo file by running the below command:

```bash
cat >/etc/yum.repos.d/opentofu.repo <<EOF
[opentofu]
name=opentofu
baseurl=https://packages.opentofu.org/opentofu/tofu/rpm_any/rpm_any/\$basearch
repo_gpgcheck=0
gpgcheck=1
enabled=1
gpgkey=https://get.opentofu.org/opentofu.gpg
       https://packages.opentofu.org/opentofu/tofu/gpgkey
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

[opentofu-source]
name=opentofu-source
baseurl=https://packages.opentofu.org/opentofu/tofu/rpm_any/rpm_any/SRPMS
repo_gpgcheck=0
gpgcheck=1
enabled=1
gpgkey=https://get.opentofu.org/opentofu.gpg
       https://packages.opentofu.org/opentofu/tofu/gpgkey
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300
EOF
```

Now you can install:

```bash
sudo yum install -y tofu
```

### MacOS

The OpenTofu package is available in the Homebrew Core repository so can be installed by running the following command:

```bash
brew install opentofu
```

## How to migrate from Terraform

It is really easy to migrate from Terraform to OpenTofu. OpenTofu acts as a drop-in replace for Terraform.

What you need to do to perform the migration is simply install OpenTofu using one of the methods
mentioned above for your operating system, and after that run:

```bash
tofu init -upgrade
```

This will ensure that you will use the OpenTofu registry for your providers.

After that, all of the Terraform commands that you love and use can be performed using the tofu binary

## OpenTofu Components explained

As OpenTofu was created as a Terraform fork and has backward compatibility with Terraform
versions up to 1.6, it has the same basic components.

### Provider

OpenTofu Providers are essentially a plugin that enable OpenTofu to interact with other resources.
They are a bridge that provide an interface between OpenTofu configuration and the corresponding
resource API calls.

This approach allows OpenTofu to essentially interact with any environments if they have an API,
As its open-source, you can easily use pre-existing or create providers to plugin to different
platforms like VMware, AWS, DigitalOcean and Proxmox.

Each provider is tailored for the specific product it integrates with allowing ease of management through
OpenTofu.

### Resource

The resources in OpenTofu refer to the infrastructure elements that OpenTofu is able to manage.
This includes items such as Virtual Machines, DNS Records, Virtual Networks and many more resource types.

Each resource is defined by a resource type, these come with additional configuration options like size,
CIDR Block etc.

OpenTofu facilitates the creation, update and deletion of these resources. It automatically manages
dependencies between resources to ensure they are created or updated in the correct order. If required
you can also implement specific dependencies with the `depends_on` option.

#### Example Resource

```terraform
resource "aws_instance" "my_instance" {
  instance_type = "t4g.nano"
  tags = {
    Name = "test-instance"
  }
}
```

### Provisioners

Provisioners are a distinct set of providers that server a different purpose. They allow you to execute
certain commands or scripts either on a local or remote machine. They also enable the transfer of files
from your local machine to remote. These are contained within a null resource, which you add to your
configuration.

Provisioners are a last resort, as they step outside teh tools declarative model. This model focuses
on defining the end-state of your infrastructure, but provisioners perform imperative actions.

There are three main provisioners:

- **file**: Used to transfer fileds, typically with a connection block for specifying details of the
  remote machine.
- **local-exec**: Executes commands locally.
- **remote-exec**: Executes commands on remote, typically with a connection block for specifying
  details of the remote machine.

#### Example Provisioner

```terraform
resource "null_resource" "this" {
  provisioner "local-exec" {
    command = "echo Hello World!"
  }
}
```

### Datasource

A datasource is a configuration element designed to fetch data from an external source. This can then
be utilised as a parameter within a resource.

These data sources are specified as part of the provider and accessed via a special resource known
as a data resource, which is declared using a `data` block. The structure of a data source closely
resembles that of a resource. Therefore, making it easy to adopt if you are already familiar with
the resource configuration.

#### Example Datasource

```terraform
data "aws_ami" "example" {
  most_recent = true

  owners = ["self"]
  tags = {
    Name   = "app-server"
    Tested = "true"
  }
}
```

### Variables and Outputs

#### Local

Local variables are a convenient way of assigning a value to an expression. They are defined in a
local block and are referenced with the `local` prefix

They can be useful for reducing repetition and making your code more readable and maintainable.
This capability to define and manipulate a wide range of attributes and operations through locals
is essential for creating efficient and streamlined infrastructure code. It ensures that
configurations remain functional, organised and easy to understand, an important
consideration in the evolving landscape of infrastructure management.

##### Example Local

```terraform
locals {
  cidr_block = "10.10.0.0/16"
  name       = "my-block"
}
```

#### Variable

Variables provide a way to parametrise configuration files, enhancing their flexibility and reusability.
These are declared in configurations and can be used to input values without modifying the core configuration.

There are many different types of variables, OpenTofu is capable of detecting the type, however its
always best to specify to ensure it is correct, [a list of these types is available on the OpenTofu website](https://opentofu.org/docs/language/values/variables/#type-constraints).

##### Example Variable

```terraform
variable "image_id" {
  type = string
}

variable "availability_zone_names" {
  type    = list(string)
  default = ["us-west-1a"]
}
```

#### Output

An output enables you to view the value of a specific resource, local, resource or variable after
OpenTofu has executed your configuration changes on your infrastructure.

This output is defined in the OpenTofu configuration file and can be accessed using the `tofu output`
command, but only after an `tofu apply` has been executed. Additionally, outputs can be created
to share various resources within a module.

Outputs don’t rely on any specific provider – they are a unique type of block that operates independently.

##### Example Output

```terraform
output "instance_ip_addr" {
  value = aws_instance.server.private_ip
}
```

## Key Features

OpenTofu offers several key features that make it a powerful tool for managing infrastructure as code:

- **Modular Design**: Organize your code into reusable modules, making it easier to manage complex infrastructures.
- **State Management**: Keep track of the state of your managed infrastructure and ensure changes are applied consistently.
- **Execution Plans**: Review and confirm changes before they're executed, ensuring you understand what's being changed.
- **Provider Ecosystem**: Leverage a range of providers to extend OpenTofu's functionality to various technology stacks and services.

## Best practices

To get the most out of OpenTofu, follow these best practices:

- **Version Control**: Use version control systems like Git to track changes, facilitate collaboration,
  and easily retrieve older versions if needed.
- **Modular Code**: Write modular code that's easy to reuse, maintain, and scale. This will help you
  keep your projects organised and DRY (Don't Repeat Yourself).
- **Remote State**: Take advantage of remote state storage to enhance team collaboration and prevent
  parallel operations from causing conflicts.
- **Variables and Outputs**: Use variables to promote reusability and flexibility, and leverage
  outputs to share information about resources and export them from modules.
- **Limit Manual Changes**: Whenever possible, use infrastructure as code (IaC) to manage changes,
  rather than making manual changes. This will help you maintain consistency and reduce errors.

## Key Points

Now that OpenTofu has reached a stable state, it's an excellent time to start migrating your projects.
While feature parity with Terraform is currently maintained, it's likely that this will drift over
time, making migration more challenging. By starting early, you can take advantage of OpenTofu's
unique features and avoid potential issues later on.
