---
id: 469
title: vCloud Director and vCenter Proxy Service Failure
date: 2014-07-11T15:48:11+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=469
permalink: /vcloud-director-vcenter-proxy-service-failure/
post_views_count:
  - "1766"
categories:
  - VMware
tags:
  - cell
  - error
  - multi-cell
  - proxy
  - vapps
  - vcd
  - vcenter
  - vcloud
---
Over the past couple of weeks I have spent some time working with VMware vCloud Director 5.1. I will also be producing multiple other guides for vCloud Director as I use it more over the coming months. 

One issue that we have hit a few times was the vCD cell stopped working properly (Multi-cell environment). I could log into the vCD provider and organization portals but the deployment of vApps would run for an abnormally long time and then fail after 20 minutes.  
<!--more-->

The first thing I tried to do to resolve this issue was reconnect vCenter to vCloud, in the past this has been the solution to this type of problem, however I noticed two problems: 

Problem #1: Performing a Reconnect on the vCenter Server object resulted in **Error performing operation** and **Unable to find the cell running this listener**.

Problem #2: **None of the cells have a vCenter proxy service running on the cell server.**

I then stumbled upon some SQL Queries that I wasn&#8217;t too sure about, I passed these over to VMware and they confirmed this is the correct action to take and it is none destructive. The below steps take you through resolving this issue: 

1. Stop all your Cells 

<pre class="lang:default decode:true " >service vmware-vcd stop</pre>

2. Backup the entire vCloud SQL Database. This is just a precaution.  
3. run the below query in SQL Management Studio

<pre class="lang:tsql decode:true " >USE [vcloud]
GO

– shutdown all cells before executing
delete from QRTZ_SCHEDULER_STATE
delete from QRTZ_FIRED_TRIGGERS
delete from QRTZ_PAUSED_TRIGGER_GRPS
delete from QRTZ_CALENDARS
delete from QRTZ_TRIGGER_LISTENERS
delete from QRTZ_BLOB_TRIGGERS
delete from QRTZ_CRON_TRIGGERS
delete from QRTZ_SIMPLE_TRIGGERS
delete from QRTZ_TRIGGERS
delete from QRTZ_JOB_LISTENERS
delete from QRTZ_JOB_DETAILS
go</pre>

4. Start one of your Cells and verify that the issue is resolved 

<pre class="lang:default decode:true " >service vmware-vcd start</pre>

5. Start the remaining cells. 

The script should run successfully wiping out all rows in each of the named tables.

I was now able to restart the vCD cell and my problems were gone. Everything was working again. All errors have vanished. 

These [vCenter Proxy Service] issues are usually caused by a disconnect from the database, causing the tables to become stale. vCD constantly needs the ability to write to the database and when it cannot, the cell ends up in a state that is similar to the one that you have seen.  
The qrtz tables contain information that controls the coordinator service, and lets it know when the coordinator to be dropped and restarted, for cell to cell fail over to another cell in multi cell environment.  
When the tables are purged it forces the cell on start up to recheck its status and start the coordinator service. In your situation the cell, due to corrupt records in the table was not allowing this to happen. So by clearing them forced the cell to recheck and to restart the coordinator.