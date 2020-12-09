---
id: 711
title: VMware Transparent Page Sharing TPS
date: 2015-07-22T14:21:10+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=711
permalink: /vmware-transparent-page-sharing-tps/
xyz_fbap:
  - "1"
xyz_lnap:
  - "1"
xyz_twap:
  - "1"
post_views_count:
  - "864"
  - "864"
  - "864"
  - "864"
  - "864"
  - "864"
categories:
  - VMware
tags:
  - disable
  - page
  - sharing
  - tps
  - transparent
  - vmware
  - vulnerability
---
### What is TPS?

Transparent Page Sharing (TPS) is a host process that leverage&#8217;s Virtual Machine Monitor (VMM) component of the VMkernel to scan physical host memory to identify duplicate VM memory pages. The benefits of TPS are that it allows a host to reduce memory usage so you can allow more VMs onto a host, as memory is often one of the most constrained resources on a host. TPS is basically de-duplication for RAM and works at the 4KB block level.  
<!--more-->

[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/07/TPS.png" alt="TPS" width="1272" height="352" class="aligncenter size-full wp-image-713" />](http://35.176.61.220/wp-content/uploads/2015/07/TPS.png)

In some situations multiple virtual machines will have identical sets of memory content, TPS allows these sets to be &#8220;De-duplicated&#8221; thus using less overall memory on the host. As you can see from the image above, this displays a host with TPS Enabled and one with TPS Disabled. As you can see TPS uses much less memory where blocks are duplicated. 

### What has changed?

VMware recently acknowledged a vulnerability with their TPS feature that could in very specific scenarios allow VM’s to access memory pages of other VMs running on a host. It is important to note that this vulnerability is not easily exploitable and the risk is really low so most environments should not really be impacted by it. However VMware have been cautious and released patches to disable this feature by default in the following updates: 

ESXi 5.5, Patch ESXi550-201501001  
ESXi 5.1 Update 3  
ESXi 5.0 Patch ESXi500-201502001

All versions of vSphere are vulnerable to the exploit but VMware is only patching the 5.x versions of vSphere as 4.x versions are no longer supported. These patches only disable TPS which is currently enable by default, they do not fix the vulnerability. VMware states in the KB article that &#8220;Administrators may revert to the previous behaviour if they so wish&#8221; 

The benefits that TPS provides will vary in each environment depending on VM workloads so if you want to be PCI Compliant or are paranoid about security you will probably want to leave TPS Disabled. You can view the effectiveness of TPS in vCenter by looking at the &#8220;shared&#8221; and &#8220;sharedcommon&#8221; memory counters to see how much it is benefiting you.