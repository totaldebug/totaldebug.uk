---
title: How to view which Virtual Machines have Snapshots in VMware
date: 2014-01-16
layout: post
---
This is a question that I have been asked quite a lot recently. I have found multiple ways to do this but 2 are ones that I have used and find the most suitable.
<!--more-->

  1. Using vSphere Client
      1. In vCenter go to: Home > Inventory > Datastores and Datastore Clusters
      2. Select your cluster in the left panel
      3. Choose &#8220;Storage Views&#8221; tab in the right pane.
      4. Sort by &#8220;Snapshot Space&#8221;
      5. Anything with more than 0.00b has a snapshot present
  2. Using Power CLI
      1. Connect to vCenter with PowerCLI
      2. Run this command: get-vm | get-snapshot | format-list vm,name

You may also be interested in this article: [Email Report Virtual Machine Snapshots](/email-report-virtual-machines-snapshots)
