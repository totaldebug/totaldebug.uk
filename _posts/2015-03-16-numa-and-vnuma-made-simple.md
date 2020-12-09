---
id: 634
title: NUMA and vNUMA made simple!
date: 2015-03-16T12:02:35+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=634
permalink: /numa-and-vnuma-made-simple/
post_views_count:
  - "1600"
voted_IP:
  - 'a:3:{s:15:"115.114.126.186";i:1426682486;s:12:"86.139.145.7";i:1426777649;s:14:"109.231.196.34";i:1475833226;}'
votes_count:
  - "3"
xyz_fbap:
  - "1"
xyz_lnap:
  - "1"
xyz_twap:
  - "1"
categories:
  - VMware
tags:
  - cpu
  - memory
  - 'N%L'
  - non-uniform
  - numa
  - vmware
  - vNuma
---
## What is NUMA?

Most modern CPU’s, Intel new Nehalem’s and AMD’s veteran Opteron are NUMA architectures. NUMA stands for Non-Uniform Memory Access. Each CPU get assigned its own &#8220;local&#8221; memory, CPU and memory together form a NUMA node (as shown in the diagram below).

Memory access time can differ due to the memory location relative to a processor, because a CPU can access it own memory faster than remote memory thus creating higher latency if remote memory is required.

<!--more-->

In short NUMA links multiple small high performing nodes together inside a single server.

[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/03/NUMA.png" alt="NUMA Diagram" width="1346" height="435" class="aligncenter size-full wp-image-636" />](http://35.176.61.220/wp-content/uploads/2015/03/NUMA.png)

## What is vNUMA

vNUMA stands for Virtual Non-Uniform Memory Access, ESX has been NUMA-aware singe 2002, with VMware ESX 1.5 Introducing memory management features to improve locality on NUMA hardware. This works very well for placing VMs on local memory for resources being used by that VM, particularly for VMs that are smaller than the NUMA node. Large VMs, however, will start to see performance issues as they breach a single node, these VMs will require some additional help with resource scheduling.

When enabled vNUMA exposes the VM OS to the physical NUMA. This provides performance improvements with the VM by allowing the OS and programs to best utilise the NUMA optimisations. VMs will then benefit from NUMA, even if the VM itself is larger than the physical NUMA nodes 

  * An administrator can enable / disable vNUMA on a VM using advanced vNUMA Controls
  * If a VM has more than eight vCPUs, vNUMA is auto enabled
  * If CPU Hot Add is enabled, vNUMA is Disabled
  * The operating system must be NUMA Aware

## How to determine the size of a NUMA node

In most cases the easiest way to determine a NUMA nodes boundaries is by dividing the amount of physical RAM by the number of logical processoes (cores), this is a very loose guideline. Further information on determining the specific NUMA node setup can be found here: 

  * <a href="https://communities.vmware.com/people/marcelo.soares/blog/2012/09/21/how-to-check-if-numa-is-enabled-on-esx-hardware" target="_Blank">VMware</a>
  * <a href="http://blogs.technet.com/b/gbanin/archive/2013/06/26/how-to-determine-the-amount-of-memory-and-logical-processor-of-each-numa-node.aspx" target="_Blank">Microsoft</a>
  * <a href="https://www.sharcnet.ca/help/index.php/Using_numactl" target="_Blank">Linux</a>

## What happens with vNUMA during vMotion?

A VM will initially have its vNUMA topology built when it is powered on, each time it reboots this will be reapplied depending on the host it sits upon, In the case of a vMotion the vNUMA will stay the same until the VM is rebooted and it will re-evaluate its vNUMA topology. This is another great argument to make sure all hardware in a cluster is the same as it will avoid NUMA mismatched which could cause severe performance issues.

## Check if a VM is using resources from another NUMA node

If you start to see performance issues with VMs then I would recommend running this test to make sure that the VM isnt using resources from other Nodes.

1. SSH to the ESXi host that the VM resides on  
2. Type esxtop and press enter  
3. Press &#8220;m&#8221;  
4. Press &#8220;f&#8221;  
5. Press &#8220;G&#8221; until a * shows next to NUMA STATS  
6. look at the column N%L this shows the numa usage if it is lower than 100 it is sharing resources from another numa node, see the example shown below:  
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/03/NumaUsage.png" alt="Numa Usage" width="684" height="182" class="aligncenter size-full wp-image-654" />](http://35.176.61.220/wp-content/uploads/2015/03/NumaUsage.png)

As you can see we have multiple VMs using different NUMA nodes, these VMs were showing slower performance than expected, once we sized them correctly they stopped sharing NUMA nodes and this resolved our issues.

## Conclusion

NUMA plays a vital part in understanding performance within virtual environments, VMware ESXi 5.0 and above have extended capabilities for VMs with intelligent NUMA scheduling and improved VM-Level optimisation with vNUMA. It is important to understand how both NUMA and vNUMA work when sizing any virtual machines as this can have a detremental effect on your environments performance