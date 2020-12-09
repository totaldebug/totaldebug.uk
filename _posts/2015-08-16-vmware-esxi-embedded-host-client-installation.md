---
id: 732
title: 'VMware ESXi Embedded Host Client Installation &#8211; Updated'
date: 2015-08-16T17:25:56+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=732
permalink: /vmware-esxi-embedded-host-client-installation/
xyz_fbap:
  - "1"
xyz_lnap:
  - "1"
xyz_twap:
  - "1"
post_views_count:
  - "2964"
  - "2964"
voted_IP:
  - 'a:1:{s:13:"193.34.173.74";i:1444478829;}'
votes_count:
  - "1"
categories:
  - VMware
tags:
  - client
  - embedded
  - esxi
  - host
  - install
  - installation
  - vib
  - vmware
  - web
---
In this article I will be showing you guys the new ESXi Embedded Host Client, this has been long awaited by many users of the Free ESXi host and allows much better management of the host.  
<!--more-->

Check out the latest version in this video: 



### Installation

The easiest way to install a VIB is to download it directly on the ESXi host.

If your ESXi host has internet access, follow these steps:  
1. Enable SSH on your ESXi host, using DCUI or the vSphere web client.  
2. Connect to the host using an SSH Client such as <a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/" target="_blank">putty</a>  
3. Run the below command: 

<pre class="lang:default decode:true " >esxcli software vib install -v http://download3.vmware.com/software/vmw-tools/esxui/esxui-2976804.vib</pre>

If the VIB installation completes successfully, you should now be able to navigate a web browser to https://<esxip>/ui and the login page should be displayed.  
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/08/esxi_web_login.png" alt="esxi_web_login" width="1920" height="955" class="aligncenter size-full wp-image-733" />](http://35.176.61.220/wp-content/uploads/2015/08/esxi_web_login.png)

### Usage

As you can see from the above login screenshot, the page is the same one used for vCenter Server, On logging in you will also see the menu structures also follow this look and feel.  
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/08/esxi_web_home.png" alt="esxi_web_home" width="1918" height="958" class="aligncenter size-full wp-image-734" />](http://35.176.61.220/wp-content/uploads/2015/08/esxi_web_home.png)

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
1. Connect to the host using and SSH Client such as <a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/" target="_blank">putty</a>  
2. Log into the host and run the following command:

<pre class="lang:default decode:true " >esxcli software vib remove -n esx-ui</pre>

Any comments / tips / tricks are always appreciated.