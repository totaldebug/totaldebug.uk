---
title: How to setup an NFS mount on CentOS 6
date: 2014-06-24
layout: post
---
### About NFS (Network File System) Mounts

NFS mounts allow sharing a directory between several servers. This has the advantage of saving disk space, as the directory is only kept on one server, and others can connect to it over the network. When setting up mounts, NFS is most effective for permanent fixtures that should always be accessible.<!--more-->

### Setup

An NFS mount is set up between at least two servers. The machine hosting the shared directory is called the server, while the ones that connect to it are clients.

This tutorial will take you through setting up the NFS server.

The system should be setup as root

```sh
sudo su -
```

### Setting up the NFS Server

#### 1. Install the required software and start services

First we use yum to install the required nfs programs.

```sh
yum install nfs-utils nfs-utils-lib
```

Now we will run the startup scripts for the NFS Server:

```sh
chkconfig nfs on
chkconfig portmap on
service portmap start
service nfs start
```

#### 2. Export the shared directory

The next step is to make the directory we want to share available to our clients. The chosen directory should then be added to `/etc/exports`, which specifies both the directory to be shared and the share permissions.

If we wanted to share the directory `/home` we would do the following:

We would edit Exports:

```sh
vi /etc/exports
```

Add the following lines to the file, sharing the directory with the client:

```sh
/home           12.33.44.555(rw,sync,no_root_squash,no_subtree_check)
```

These settings achieve the following:

  1. **rw:** This option allows the client to both read and write within the shared directory
  2. **sync:** Sync confirms requests to the shared directory only once the changes have been committed.
  3. **no\_subtree\_check:** This option prevents the subtree checking. When a shared directory is the subdirectory of a larger filesystem, nfs performs scans of every directory above it, in order to verify its permissions and details. Disabling the subtree check may increase the reliability of NFS, but reduce security.
  4. **no\_root\_squash:** This phrase allows root to connect to the designated directory

Once completed save the file and exit it, then run the following command to export the settings:

```sh
exportfs -a
```

You now have a fully functioning NFS server. If there is anything you think I have missed from this tutorial please comment below.
