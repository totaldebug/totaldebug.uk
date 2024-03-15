---
title: "Proxmox Template with Cloud Image and Cloud Init"
date: 2022-10-04 19:54:00 +0100
image:
  path: assets/img/posts/proxmox-template-with-cloud-image-and-cloud-init/thumb.png
categories: [Automation]
tags: [proxmox, ubuntu, cloud-init, cloud-image, linux, clone, template]
series: Automating Proxmox Deployments
---

> Updated to latest Ubuntu image & Added enable for qemu service
{: .prompt-info }

Using Cloud images and Cloud init with Proxmox is the quickest, most efficient way to deploy servers at this time. Cloud images are small cloud certified that have Cloud init pre-installed and ready to accept configuration.

Cloud images and Cloud init also work with Proxmox and if you combine this with Terraform  you have a fully automated deployment model. See [Automating deployments using Terraform with Proxmox and ansible]({% post_url 2023-05-06-automating-proxmox-with-terraform-ansible %}) for instructions on how to do this.
int

## Guide

### Download image

First you will need to choose an [Ubuntu Cloud Image](https://cloud-images.ubuntu.com/)

Rather than downloading this, copy the URL.

Then SSH into your Proxmox server and run wget with the URL you just copied, similar to below:

```shell
wget https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img
```

This will download the image onto your proxmox server ready for use.

### Install packages

The `qemu-guest-agent` is not installed on the cloud-images, so we need a way to inject that into out image file. This can be done with a great tool called `virt-customize` this is installed with the package `libguestfs-tools`. [libguestfs](https://www.libguestfs.org/) is a set of tools for accessing and modifying virtual machine (VM) disk images.

Install:

```shell
sudo apt update -y && sudo apt install libguestfs-tools -y
```

Install `qemu-guest-agent` into the downloaded image:

```shell
sudo virt-customize -a jammy-server-cloudimg-amd64.img --install qemu-guest-agent --run-command 'systemctl enable qemu-guest-agent.service'
```

You can also install other packages at this point.

### Adding users to the image (Optional)

It is possible to also add a user and SSH keys with the `virt-customize`. This is useful for automation such as terraform.

```shell
sudo virt-customize -a jammy-server-cloudimg-amd64.img --run-command 'useradd simone'
sudo virt-customize -a jammy-server-cloudimg-amd64.img --run-command 'mkdir -p /home/simone/.ssh'
sudo virt-customize -a jammy-server-cloudimg-amd64.img --ssh-inject simone:file:id_ed25519.pub
sudo virt-customize -a jammy-server-cloudimg-amd64.img --run-command 'chown -R simone:simone /home/simone'
```

1. Adds the user to the image
1. Makes the SSH Key directory
1. Injects the SSH Key. `simone` is the user the key will apply to, `file:id_ed25519.pub` is the file on the local host where the SSH Key is located
1. Makes sure the user simone owns the home folder

### Create a virtual machine from the image

Now we need to create a new virtual machine:

```shell
qm create 9000 --memory 2048 --core 2 --name jammy-template --net0 virtio,bridge=vmbr0
```

Import the downloaded Ubuntu disk to the correct storage:

```shell
qm importdisk 9000 jammy-server-cloudimg-amd64.img local-lvm
```

Attach the new disk as a SCSI drive on the SCSI Controller:

```shell
qm set 9000 --scsihw virtio-scsi-pci --scsi0 local-lvm:vm-9000-disk-0
```

Add cloud init drive:

```shell
qm set 9000 --ide2 local-lvm:cloudinit
```

Make the could init drive bootable and restrict BIOS to boot from disk only:

```shell
qm set 9000 --boot c --bootdisk scsi0
```

Add serial console:

```shell
qm set 9000 --serial0 socket --vga serial0
```

Turn on guest agent:

```shell
qm set 9000 --agent enabled=1
```

> DO NOT POWER ON THE VM
{: .prompt-warning }

### Convert the VM to a Template

Now, Create a template from the image you just created:

```shell
qm template 9000
```

## Clone the template to a VM

Now you have a fully functioning template, which can be cloned as much as you want. But it makes sense to set some of the settings.

First, clone the VM (here we are cloning the template with ID 9000 to a new VM with ID 999):

```shell
sudo qm clone 9000 999 --name test-cloud-init
```

Next, set the SSH keys (if you didn't add yours earlier) and IP address:

```shell
sudo qm set 999 --sshkey ~/.ssh/id_rsa.pub
sudo qm set 999 --ipconfig0 ip=10.10.1.20/24,gw=10.10.1.1
```

It’s now ready to start up!

```shell
sudo qm start 999
```

You should be able to log in without any problems (after trusting the SSH fingerprint). Note that the username is `ubuntu`, for the key set here. If you added your own user earlier, you can use that instead

```shell
ssh ubuntu@10.10.1.1
```

Once happy with the template, you can stop the VM and clean up the resources:

```shell
sudo qm stop 999 && sudo qm destroy 999
rm jammy-server-cloudimg-amd64.img
```

## References

[https://registry.terraform.io/modules/sdhibit/cloud-init-vm/proxmox/latest/examples/ubuntu_single_vm](https://registry.terraform.io/modules/sdhibit/cloud-init-vm/proxmox/latest/examples/ubuntu_single_vm)

## Closing

Hopefully this information was useful for you, If you have any questions about this article and share your thoughts head over to my [Discord](https://discord.gg/6fmekudc8Q).
