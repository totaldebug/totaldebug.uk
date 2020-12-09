---
title: Docker Overlay2 with CentOS for Production
excerpt: >-
  Run through how to setup Docker to use Overlay2 with
  CentOS for use in production.
date: '2020-05-05'
thumb_img_path: /assets/images/2020-05-05-docker-overlay2-centos-production.png
content_img_path: /assets/images/2020-05-05-docker-overlay2-centos-production.png
layout: post
---

## Pre-Requisites

- Add an extra drive to CentOS (this could also be freespace on the existing disk)
- Have docker installed (services stopped)

## Setup

First we need to find out new disk:
```
fdisk -l
```

Once we have our new disk, we can start to create a our logical volume:
```
pvcreate /dev/sdb -f
vgcreate docker_vg /dev/sdb
lvcreate -n docker_xfs -l 100%FREE docker_vg
```

Now that we havve our logical volume, check that it doesnt have xfs on it already:
```
xfs_info /dev/docker_vg/docker_xfs
```

Create an XFS and mount the new volume:
```
mkfs.xfs /dev/docker_vg/docker_xfs -f -n ftype=1
mkdir /var/lib/docker
mount /dev/docker_vg/docker_xfs /var/lib/docker
```

Add this to fstab in order to ensure it mounts on reboot `vi /etc/fstab`

```
/dev/docker_vg/docker_xfs/ /var/lib/docker xfs rw,relatime,seclabel,attr2,inode64,noquota 0 0
```

Now we can start our docker services

```
systemctl start docker
```

To test that this has worked, run the following, you should see that now you are using Overlay2 as the storage driver:
```
docker info
```
