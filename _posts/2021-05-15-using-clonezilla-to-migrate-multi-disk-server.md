---
title: Using CloneZilla to migrate multiple disk server
excerpt: >-
  I have been migrating all of my servers to ProxMox, however one issue I found was migrating VMs with multiple disks, in this article I explain my process.
date: 2021-05-15 00:00:00 +0100
image:
  path: thumb.png
categories: [Virtualisation, Proxmox, Migration]
tags: [clonezilla, proxmox, vmware, migration]
---

## Overview

I recently decided to migrate all of my home servers to Proxmox from VMware ESXi, many factors at play but the main being that new versions of ESXi don't support my hardware.

For a normal migration I would just use CloneZilla's remote-source to remote-dest feature, however I could only get this to work for a single source disk, which is fine for the majority of my servers, however I do have some with multiple disks which became an issue.

## What was the problem?

At its core [CloneZilla](https://clonezilla.org/) is designed to clone a single disk to multiple other disks, you can do this many different ways, however if you have a machine with multiple disks then it is not possible to do this in the traditional way that most tutorials online show you.

I really struggled to find any information on this subject, and most of my research turned up how to clone a single disk to multiple disks rather than how to clone multiple disks to multiple disks!

Its easy to see how this could be difficult for [CloneZilla](https://clonezilla.org/), I mean how would it know which two disks to clone the source data to on the destination? without some form of GUI where you need to pair up all the disks it would be difficult.

## The solution

In order to overcome this issue, I created a [CloneZilla](https://clonezilla.org/) image this was cloned onto an NFS share. Once complete, I was able to load the image on the destination machine, as there were only two disks in the destination server the image was applied without any issue, on boot I could see that both disks had been cloned over from the image.

The only thing I didn't like about this is that I had to first create the image, then deploy that image, when I only have one server to clone and not need for an image it would be nice for [CloneZilla](https://clonezilla.org/) to implement something in the remote-source / remote-dest that allows this functionality.

## Final Thoughts

[CloneZilla](https://clonezilla.org/) is an excellent tool for performing these migrations, It's very easy to use and clones the images quite quickly. In my opinion it is much easier than other solutions provided on the Proxmox website, in fact other methods using the OVF Tool never worked for me (there are also lots of reports of other users having the same issues) which is why I ended up going with [CloneZilla](https://clonezilla.org/).

If you have had any experience with Proxmox migrations using [CloneZilla](https://clonezilla.org/) or have a trick that makes the OVF Tool migrations work please let me know over on my [Discord](https://discord.gg/6fmekudc8Q).
