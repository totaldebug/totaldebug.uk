---
id: 520
title: Understanding Resource Pools in VMware
date: 2015-02-09T20:05:27+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=520
permalink: /understanding-resource-pools-vmware/
post_views_count:
  - "1391"
voted_IP:
  - 'a:1:{s:12:"82.31.38.177";i:1426014599;}'
votes_count:
  - "1"
xyz_fbap:
  - "1"
xyz_lnap:
  - "1"
xyz_twap:
  - "1"
categories:
  - VMware
tags:
  - Powercli
  - powershell
  - resource pool
  - usage
  - vmware
  - vsphere
---
It is my experience that resource pools are nearly a four letter word in the virtualization world. Typically I see a look of fear or confusion when I bring up the topic, or I see people using them as folders. Even with some other great resources out there that discuss this topic, a lack of education remains on how resource pools work, and what they do. In this post, I’ll give you my spin on some of the ideals behind a resource pool, and then discuss ways to properly balance resource pools by hand and with the help of some PowerShell scripts I have created for you.  
<!--more-->

## What is a Resource Pool?

A VMware resource pool is a way of guaranteeing or providing higher priority on a VM&#8217;s CPU and/or Memory, the priority set at the pool is then split between each of the individual VM&#8217;s in that pool equally.

## Who Needs Resource Pools?

You can’t make a resource pool on a cluster unless you have DRS running. So, if your license level excludes DRS, you can&#8217;t use resource pools. If you are graced with the awesomeness of DRS, you may need a resource pool if you want to give different types of workloads different priorities for two scenarios:

  * For when memory and CPU resources become constrained on the cluster.
  * For when a workload needs a dedicated amount of resources at all times.

Now, this isn&#8217;t to say that a resource pool is the only way to accomplish these things – you can use per VM shares and reservations. But, these values sometimes reset when a VM vMotions to another host, and frankly it’s a bit of an administrative nightmare to manage resource settings on the VMs individually.

I personally like resource pools and use them often in a mixed workload environment. If you don’t have the luxury of a dedicated management cluster, resource pools are an easy way to dedicate resources to your vCenter, VUM, DB, and other “virtual infrastructure management” (VIM) VMs.

## Why People Fear Resource Pools

People fear resource pools because they are mysterious. Ok, maybe not that mysterious, but they are a bit awkward at first, one common missuse of resource pools that I see quite a lot is as folders, to sort VM&#8217;s rather than as a performance control. Also, they are easy to misunderstand, and thus misuse. Below is a graphic I&#8217;ve created that shows a typical scenario where someone has deployed a resource pool without understanding fully how they work. Look through the graphic and then we’ll discuss further.

[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/02/Resource-Pools.jpg" alt="Resource Pools" width="800" height="605" />](http://35.176.61.220/wp-content/uploads/2015/02/Resource-Pools.jpg)

## Where Did I Get The Numbers?

Let’s start with the resource pools. You’ll notice 3 points for each pool – the shares (high, normal or low), the amount of shares for RAM, and the amount of shares for CPU. Here is the math ([supporting document](http://pubs.vmware.com/vsphere-55/topic/com.vmware.ICbase/PDF/vsphere-esxi-vcenter-server-55-resource-management-guide.pdf)):

  * RAM is calculated like this: [Cluster RAM in MB] * [20 for High | 10 for Normal | 5 for Low]
  * Our cluster has 100 GB of RAM (grey section) and so the math is: 102,400 MB of RAM \* 20 = 2,048,000 for High and 102,400 MB of RAM \* 5 = 512,000 for Low
  * CPU is calculated like this: [Cluster CPU Cores] * [2,000 for High, 1,000 for Normal, 500 for Low]
  * Our cluster has 100 CPU cores (grey section) and so the math is: 100 \* 2,000 = 200,000 for High and 100 \* 500 = 50,000 for Low

Based on this, the Production resource pool has roughly 80% of the shares. However, when you divide those shares for the resource pool by the number of VMs that live in the resource pool, you start to see the problem. The bottom part of the graphic shows the entitlements at a **Per VM** level. Test has more than twice what Production has when looking at individual VMs.

The below script will calculate the Per VM resource allocation for you: 

<pre class="height-set:true height:200 lang:default decode:true " data-url="https://raw.githubusercontent.com/SpottedHyenaUK/VMwareScripts/master/ResourcePools/Get-ResourcePoolSharesReport.ps1" ></pre>

The script has many options and will calculate what the share value should be by using the **-RecommendedShares**

## Maintaining the Balance

So now you are thinking oh no! My resource pools are totally wrong and this could be causing all my performance issues, so how do you keep the balance?

The trick to keeping your resource pools balanced is to work it out backwards and never, ever use the default high, normal, and low shares values. Decide the weight of your per VM shares first. Let’s say that I want my Test VMs to receive half as much share weight as Production. Shares are an arbitrary value that just determine weight, they aren’t a magic number so you could create your own values. I prefer to stick with the VMware defaults, this way you know where you stand. So, let’s give Test VMs 500 shares per CPU and Per MB Ram each, and Production VMs 2000 shares per CPU and Per MB Ram. I would change the resource pools to this:  
**Calculations:**  
[Total amount of VM RAM in Pool] * [shares] = [Required RAM Shares]  
[Total amount of VM vCPU in Pool] * [shares] = [Required CPU Shares]

I would recommend having all virtual machines in a resource pool to avoid any issues with balancing your load. If you don&#8217;t want to do that then make sure you set your custom shares according to the VMware standards. 

**Our resource pools:**  
Production would get 90,000 \* 20 = 180,000 shares of RAM, 90 \* 2000 = 180,000 shares of CPU  
Test would get 10,000 \* 5 = 50000 shares of RAM, 10 \* 500 = 5000 Shares of CPU

Much easier, right? Note! If the number of VMs in the resource pool change, you’ll need to update the resource pool shares value to reflect the added VMs. Your options are to manually update the pool when the number of VMs inside change (no fun) or use PowerCLI!

[<img loading="lazy" class="aligncenter size-full wp-image-528" src="http://35.176.61.220/wp-content/uploads/2015/02/PowerCLI.png" alt="PowerCLI" width="237" height="236" />](http://35.176.61.220/wp-content/uploads/2015/02/PowerCLI.png)

## Using PowerCLI to Balance Resource Pool Shares

Now let&#8217;s do some coding. This very basic script will connect to the vCenter server and cluster specified and look at the resource pools within. It then reports on the number of VMs contained within and offers to adjust the shares value based on an input you provide. It confirms before making any changes:

<pre class="lang:ps decode:true  height:200" data-url="https://raw.githubusercontent.com/SpottedHyenaUK/ResourcePoolScripts/master/Set-ResourcePoolShares.ps1" ></pre>

Script Usage: 

<pre class="lang:ps decode:true " >.\Set-ResourcePoolShares.ps1 -vcenter "vCenter.domain.com" -cluster "your-cluster"</pre>

I am also in the process of writing some more resource pool scripts that will email a report should you have any pools not at the correct resource levels. 

You can find all of my various scripts in my <a href="https://github.com/SpottedHyenaUK/VMwareScripts" target="_blank">GitHub repository</a>

## Final Thoughts

I hope this has helped you understand when to use and cleared some confusion around resource pools, although it is a big chunk of information to swallow in one bite, and I’m sure there are a lot of other opinions floating around out there that won’t agree with mine. I’m OK with that. One thing that would be a great feature would be the ability to set per VM shares on the resource pool, and let the pool automatically adjust for membership values.

Any comments and views are appreciated so please share.