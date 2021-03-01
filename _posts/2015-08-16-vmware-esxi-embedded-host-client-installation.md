---
title: 'VMware ESXi Embedded Host Client Installation &#8211; Updated'
date: 2015-08-16
layout: post
---
In this article I will be showing you guys the new ESXi Embedded Host Client, this has been long awaited by many users of the Free ESXi host and allows much better management of the host.
<!--more-->

Check out the latest version in this video:



### Installation

The easiest way to install a VIB is to download it directly on the ESXi host.

If your ESXi host has internet access, follow these steps:
1. Enable SSH on your ESXi host, using DCUI or the vSphere web client.
2. Connect to the host using an SSH Client such as [putty](http://www.chiark.greenend.org.uk/~sgtatham/putty/)
3. Run the below command:

```sh
esxcli software vib install -v http://download3.vmware.com/software/vmw-tools/esxui/esxui-2976804.vib
```

If the VIB installation completes successfully, you should now be able to navigate a web browser to https://<esxip>/ui and the login page should be displayed.

### Usage

The login page is the same one used for vCenter Server, On logging in you will also see the menu structures follow this look and feel.

From the interface you are able to do most of the features seen in the old VI Client. It is very responsive (compared to the vCenter versions) and seems to work well.

One feature that is a little frustrating is the inability to edit settings of a powered on virtual machine. So you would either need to use command, the old VI Client or Power Off the VM.

A few things that are still &#8220;under construction&#8221; are:
**Host Management**

Authentication

Certificates

Profiles

Power Management

Resource Reservation

Security

Swap

Host -> Manage -> Virtual Machines View</ol </ul>

**Virtual Machine**

Log Browser

**Networking**

Monitor Tasks

### Removal

To remove the ESXi embedded host client from your ESXi host, you will need to use esxcli and have root privileges on the host.
1. Connect to the host using and SSH Client such as [putty](http://www.chiark.greenend.org.uk/~sgtatham/putty/)
2. Log into the host and run the following command:

```sh
esxcli software vib remove -n esx-ui
```

If you have any comments, tips or tricks, please let me know over on my [Discord](https://discord.gg/6fmekudc8Q)
