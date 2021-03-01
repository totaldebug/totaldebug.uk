---
title: VMware Distributed Switches (dvSwitch)
date: 2015-02-18
layout: post
---
In this article I am going to take you through what a Distributed switch or dvSwitch is and how it is used, I will also talk about why backing them up is so important, then show you how to backup by hand and with the help of some PowerShell scripts I have created for you.
<!--more-->

## What is a distributed switch?

A distributed switch (dvSwitch) is very similar to a standard vSwitch, the main difference is that the switch is managed by vCenter instead of the individual ESXi Hosts, the ESXi/ESX 4.x and ESXi 5.x hosts that belong to a dvSwitch do not need further configuration to be compliant.

Distributed switches provide similar functionality to vSwitches. dvPortgroups is a set of dvPorts. The dvSwitch equivalent of portgroups is a set of ports in a vSwitch. Configuration is inherited from dvSwitch to dvPortgroup, just as from vSwitch to Portgroup.

Virtual machines, Service Console interfaces (vswif), and VMKernel interfaces can be connected to dvPortgroups just as they could be connected to portgroups in vSwitches.

This means that if you have 100 ESXi Hosts you only need to configure the PortGroups once and then add the ESXi Hosts to the dvSwitch rather than configuring the networking individually on each host.

## How Do You Use a dvSwitch?

Below I have created an example of a two host cluster using a dvSwitch, the dvSwitchis first configured on vCenter and then hosts are added to the dvSwitch. Adding a host to a dvSwitch will then push the network configuration to the host.

Once a host is added to the dvSwitchyou only need to assign the VMK&#8217;s and IP Addresses for it to begin functioning correctly. If you have migrated from a vSwitch you can migrate the VMK&#8217;s across saving additional configuration.

[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/02/vdSwitch.png" alt="vdSwitch diagram" width="1017" height="621" class="aligncenter size-full wp-image-623" />](http://35.176.61.220/wp-content/uploads/2015/02/vdSwitch.png)

As you can see from the image there are a few differences from a standard switch, you now have &#8220;dvUplinks&#8221; these are virtual vmnic&#8217;s for the physical network cards that are associated to the same service. e.g. management on host A could be vmnic0 where as on host B it could be vmnic8 without dvUplinks we would not be able to assign the same service to different vmnics on each host.

After you get your head around dvUplinks everything else falls into place, the rest of the dvSwitch is the same as a standard switch (other than features)

VMK&#8217;s are host specific due to the requirement for an IP Address, these cannot be allocated on a pool basis which is a shame. You have to manually add VMK&#8217;s by going to the host network configuration, selecting vSphere Distributed Switch and then select Manage Virtual adapters, this will then allow you to add / remove / migrate VMK&#8217;s to and from specific port groups.

## Pros & Cons

There are only a few pros and cons to distributed switches, I have listed all the ones I am aware of below: (if you know any more please leave a comment!)

#### Pros

<ul class="show-list-item">
  <li>
    Private VLAN&#8217;s
  </li>
  <li>
    <b>Netflow</b> – ability for NetFlow collectors to collect data from the dvSwitch to determine what network device is talking and what protocols they are using
  </li>
  <li>
    <b>SPAN and LLDP</b> – allows for port mirroring and traffic analysis of network traffic using protocol analyzers
  </li>
  <li>
    Easy to add a new host
  </li>
  <li>
    Easy to add a new port group to all hosts
  </li>
  <li>
    Load Based Teaming, Load Balancing without the IP Hash worry.
  </li>
</ul>

#### Cons

<ul class="show-list-item">
  <li>
    If vCenter fails there is no way to manage your dvSwitch
  </li>
  <li>
    Requires an Enterprise Plus License
  </li>
</ul>

## Different Features

These features are available with both types of virtual switches:

<ul class="show-list-item">
  <li>
    Can forward L2 frames
  </li>
  <li>
    Can segment traffic into VLANs
  </li>
  <li>
    Can use and understand 802.1q VLAN encapsulation
  </li>
  <li>
    Can have more than one uplink (NIC Teaming)
  </li>
  <li>
    Can have traffic shaping for the outbound (TX) traffic
  </li>
</ul>

These features are available only with a Distributed Switch:

<ul class="show-list-item">
  <li>
    Can shape inbound (RX) traffic
  </li>
  <li>
    Has a central unified management interface through vCenter Server
  </li>
  <li>
    Supports Private VLANs (PVLANs)
  </li>
  <li>
    Provides potential customization of Data and Control Planes
  </li>
</ul>

vSphere 5.x provides these improvements to Distributed Switch functionality:

<ul class="show-list-item">
  <li>
    Increased visibility of inter-virtual machine traffic through Netflow
  </li>
  <li>
    Improved monitoring through port mirroring (dvMirror)
  </li>
  <li>
    Support for LLDP (Link Layer Discovery Protocol), a vendor-neutral protocol.
  </li>
  <li>
    The enhanced link aggregation feature provides choice in hashing algorithms and also increases the limit on number of link aggregation groups
  </li>
  <li>
    Additional port security is enabled through traffic filtering support.
  </li>
  <li>
    Improved single-root I/O virtualization (SR-IOV) support and 40GB NIC support.
  </li>
</ul>

## Automated dvSwitch Backup Script

Below is a script that I have written that allows automated backups of your dvSwitches.

[Get-dvSwitchBackup](https://github.com/SpottedHyenaUK/dvSwitches/raw/master/Get-dvSwitchBackup.ps1)

I have also got many other scripts available for use <a href="https://github.com/SpottedHyenaUK/" target="_blank">here on my GitHub</a>.

## Final Thoughts

vSphere Distributed Virtual Switches are definitely the correct choice for companies that have the license, is it worth buying the licensing just for dvSwitch? I wouldn&#8217;t say so unless you require one of the specific features only dvSwitch supports. When you environment starts to grow I would say they are vital to saving time deploying hosts and re-configuring networks. I would recommend that you only use one or the other and don&#8217;t use a Hybrid configuration, in a Hybrid mode you are adding more configuration for your team and also added complexity that is not required. As long as you always have a backup of your dvSwitch you will not have any issues with loss of configuration.

If you have anything to add please comment below, all feedback is appreciated.
