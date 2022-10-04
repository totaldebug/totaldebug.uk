---
title: "Proxmox Template with Cloud Image and Cloud Init"
date: 2022-10-04 19:54:00 +0100
image:
  name: thumb.png
categories: [Automation]
tags: [proxmox, ubuntu, cloud-init, cloud-image, linux, clone, template]
---

Using Cloud images and Cloud init with Proxmox is the quickest, most efficient way to deploy servers at this time. Cloud images are small cloud certified that have Cloud init pre-installed and ready to accept configuration.

Cloud images and Cloud init also work with Proxmox and if you combine this with Terraform (more on that in my next article) you have a fully automated deployment model.

# Guide

First you will need to choose an [Ubuntu Cloud Image](https://cloud-images.ubuntu.com/)

Rather than downloading this, copy the URL.

Then SSH into your Proxmox server and run wget with the URL you just copied, similar to below:

```
wget https://cloud-images.ubuntu.com/focal/current/focal-server-cloudimg-amd64.img
```

This will download the image onto your proxmox server ready for use.

Now we need to create a new virtual machine:

```
qm create 9000 --memory 2048 --core 2 --name ubuntu-template --net0 virtio,bridge=vmbr0
```

Import the downloaded Ubuntu disk to the correct storage:

```
qm importdisk 9000 focal-server-cloudimg-amd64.img local-lvm
```

Attach the new disk as a SCSI drive on the SCSI Controller:

```
qm set 9000 --scsihw virtio-scsi-pci --scsi0 local-lvm:vm-9000-disk-0
```

Add cloud init drive:

```
qm set 9000 --ide2 local-lvm:cloudinit
```

Make the could init drive bootable and restrict BIOS to boot from disk only:

```
qm set 9000 --boot c --bootdisk scsi0
```

Add serial console:

```
qm set 9000 --serial0 socket --vga serial0
```

```warning
DO NOT POWER ON THE VM
```

Now, Create a template from the image you just created:

```
qm template 9000
```

Hopefully this information was useful for you, If you have any questions about this article and share your thoughts head over to my [Discord](https://discord.gg/6fmekudc8Q).
