---
id: 691
title: How to check if a VM disk is Thick or Thin provisioned
date: 2016-03-16T14:53:34+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=691
permalink: /check-vm-disk-thick-thin-provisioned/
post_views_count:
  - "1063"
voted_IP:
  - 'a:1:{s:14:"146.197.246.82";i:1491421778;}'
  - 'a:1:{s:14:"146.197.246.82";i:1491421779;}'
  - 'a:1:{s:14:"146.197.246.82";i:1491421784;}'
  - 'a:1:{s:14:"146.197.246.82";i:1491421784;}'
  - 'a:1:{s:14:"146.197.246.82";i:1491421785;}'
votes_count:
  - "1"
  - "1"
  - "1"
  - "1"
  - "1"
categories:
  - VMware
tags:
  - disk
  - eager
  - lazy
  - Powercli
  - provisioned
  - rvtools
  - thick
  - thin
  - vmware
  - zero
---
There are multiple ways to tell if a virtual machine has thick or thin provisioned VM Disk. Below are some of the ways I am able to see this information:  
<!--more-->

### VI Client (thick client)

  * Select the Virtual Machine 
  * Choose Edit Settings
  * Select the disk you wish to check 
  * look under Type: (as shown below)

[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/07/disk.jpg" alt="Client VM Disk" width="636" height="269" class="aligncenter size-full wp-image-695" />](http://35.176.61.220/wp-content/uploads/2015/07/disk.jpg)

### Web Client

Select your Host in Host and Cluster inventory -> Related Objects -> Virtual machines tab

  * Select your Host in Host and Cluster
  * click Related Objects
  * click Virtual machines tab

### PowerCLI

  * Launch PowerCLI
  * type: connect-viserver <vCenterName> 
  * Run this command:
<pre class="lang:ps decode:true " >get-vm | Select Name, @{N="disktype";E={(Get-Harddisk $_).Storageformat}}</pre>

  * A list of all the virtual machines and disk types will be presented

### <a href="http://www.robware.net/" target="_blank">RvTools &#8211; Click to Download</a>

  * Launch RV Tools and enter the vCenter IP Address or Name
  * Enter the login details or tick use windows credentials
  * Go to the &#8220;vDisk&#8221; tab

The below image shows an example of what you should see.  
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/07/RvToolsvDisk.png" alt="RvTools VM Disk" width="1454" height="418" class="aligncenter size-full wp-image-692" />](http://35.176.61.220/wp-content/uploads/2015/07/RvToolsvDisk.png)