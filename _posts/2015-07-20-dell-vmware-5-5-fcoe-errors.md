---
id: 688
title: Dell VMware 5.5 FCoE Errors
date: 2015-07-20T11:41:36+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=688
permalink: /dell-vmware-5-5-fcoe-errors/
voted_IP:
  - 'a:3:{s:15:"143.166.226.112";i:1461943529;s:13:"15.211.201.82";i:1465473856;s:13:"204.107.230.4";i:1478126290;}'
  - 'a:3:{s:15:"143.166.226.112";i:1461943529;s:13:"15.211.201.82";i:1465473856;s:13:"204.107.230.4";i:1478126290;}'
xyz_fbap:
  - "1"
xyz_lnap:
  - "1"
xyz_twap:
  - "1"
post_views_count:
  - "1403"
  - "1403"
  - "1403"
  - "1403"
votes_count:
  - "3"
  - "3"
categories:
  - VMware
tags:
  - "5.5"
  - broadcom
  - dell
  - drivers
  - fcoe
  - u2
  - update 2
  - vmware
---
Recently I have seen an issue after upgrading some of our Dell R6xx hosts to 5.5 U2, they started showing FCoE in the storage adapters and booting took a really long time. 

I looked into this and found that the latest Dell ESXi image also includes Drivers and scripts that enable the FCoE interfaces on cards that support it.

To see if you have this problem check the below steps:  
<!--more-->

on boot press ALT + F12, this will show what ESXi is doing on boot, you will then begin to see the following errors multiple times:

<pre class="lang:default decode:true " >FIP VLAN ID unavail. Retry VLAN discovery
fcoe_ctlr_vlan_request() is done</pre>

to resolve this issue connect via SSH to the host and run the below commands: 

<pre class="lang:default decode:true " >esxcli software vib remove -n scsi-bnx2fc
cd /etc/rc.local.d/
rm 99bnx2fc.sh
esxcli fcoe nic disable -n=vmnic4
esxcli fcoe nic disable -n=vmnic5</pre>

This will remove the FCoE VIB, delete a script that runs to check for the VIB and then disable fcoe on the vmnics required. 

Hopefully this will help someone else as it took me a long time to find this solution and resolve the issue.