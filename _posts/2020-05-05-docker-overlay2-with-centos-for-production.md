---
title: Docker Overlay2 with CentOS for production
date: 2020-05-05 00:00:00 +0100
image:
  path: assets/img/posts/docker-overlay2-with-centos-for-production/thumb.png
categories: [Docker, Overlay2]
tags: [docker, overlay2, centos, production]
---

The following short article runs through how to setup docker to use overlay2 with Centos for use in production

## Pre-Requisites

- Add an extra drive to CentOS (this could also be freespace on the existing disk)
- Have docker installed (services stopped)

## Setup

First we need to find our new disk:

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

Now we can create our XFS and mount the new volume:

```
mkfs.xfs /dev/docker_vg/docker_xfs -f -n ftype=1
mkdir /var/lib/docker
mount /dev/docker_vg/docker_xfs /var/lib/docker
```

Add this to fstab in order to ensure it mounts on reboot vi /etc/fstab

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
