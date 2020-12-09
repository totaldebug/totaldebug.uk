---
id: 6350
title: Docker Overlay2 with CentOS for production
date: 2020-05-05T08:22:49+00:00
author: marksie1988
layout: post
guid: http://spottedhyena.co.uk/?p=6350
permalink: /docker-overlay2-with-centos-for-production/
ct_author_last_updated:
  - default
categories:
  - Uncategorized
tags:
  - docker
  - lvgroup
  - vgcreate
  - xfs
---
The following short article runs through how to setup docker to use overlay2 with Centos for use in production

## Pre-Requisites

  * Add an extra drive to CentOS (this could also be freespace on the existing disk)
  * Have docker installed (services stopped)

## Setup

First we need to find our new disk:

<pre class="wp-block-code"><code>fdisk -l</code></pre>

Once we have our new disk, we can start to create a our logical volume:

<pre class="wp-block-code"><code>pvcreate /dev/sdb -f
vgcreate docker_vg /dev/sdb
lvcreate -n docker_xfs -l 100%FREE docker_vg
</code></pre>

Now that we havve our logical volume, check that it doesnt have xfs on it already:

<pre class="wp-block-code"><code>xfs_info /dev/docker_vg/docker_xfs</code></pre>

Now we can create our XFS and mount the new volume:

<pre class="wp-block-code"><code>mkfs.xfs /dev/docker_vg/docker_xfs -f -n ftype=1
mkdir /var/lib/docker
mount /dev/docker_vg/docker_xfs /var/lib/docker</code></pre>

Add this to fstab in order to ensure it mounts on reboot vi /etc/fstab

<pre class="wp-block-code"><code>/dev/docker_vg/docker_xfs/ /var/lib/docker xfs rw,relatime,seclabel,attr2,inode64,noquota 0 0</code></pre>

Now we can start our docker services

<pre class="wp-block-code"><code>systemctl start docker</code></pre>

To test that this has worked, run the following, you should see that now you are using Overlay2 as the storage driver:

<pre class="wp-block-code"><code>docker info</code></pre>