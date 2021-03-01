---
title: How to check if a VM disk is Thick or Thin provisioned
date: 2016-03-16
layout: post
---
There are multiple ways to tell if a virtual machine has thick or thin provisioned VM Disk. Below are some of the ways I am able to see this information:
<!--more-->

### VI Client (thick client)

  * Select the Virtual Machine
  * Choose Edit Settings
  * Select the disk you wish to check
  * look under Type

### Web Client

Select your Host in Host and Cluster inventory -> Related Objects -> Virtual machines tab

  * Select your Host in Host and Cluster
  * click Related Objects
  * click Virtual machines tab

### PowerCLI

  * Launch PowerCLI
  * type: connect-viserver <vCenterName>
  * Run this command:
```sh
get-vm | Select Name, @{N="disktype";E={(Get-Harddisk $_).Storageformat}}
```

  * A list of all the virtual machines and disk types will be presented

### [RvTools](http://www.robware.net/)

  * Launch RV Tools and enter the vCenter IP Address or Name
  * Enter the login details or tick use windows credentials
  * Go to the &#8220;vDisk&#8221; tab
