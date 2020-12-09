---
id: 158
title: Upgrading a Cisco Catalyst 3560 Switch
date: 2012-06-27T09:15:41+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=158
permalink: /upgrading-a-cisco-catalyst-3560-switch/
post_views_count:
  - "3216"
  - "3216"
  - "3216"
categories:
  - Cisco
tags:
  - "3560"
  - 3560g
  - cisco
  - firmware
  - update
---
Here are my notes on upgrading a Catalyst 3560. I plugged in a laptop to the serial console and an ethernet cable into port 1 (technically interface Gigabit Ethernet 0/1). [Here](http://www.cisco.com/en/US/products/hw/switches/ps646/products_configuration_example09186a0080169623.shtml) is the official Cisco documentation I followed. It’s for the 3550, but the Cisco support engineer said that it’s close enough.  
<!--more-->

### **First Hurdle: VLAN Mismatch Error**

I quickly got bunch of errors that stated “Native VLAN Mismatch: discovered on Gigabit Ethernet 0/1.” The far end of the new switch is VLAN1. To fix this error, I moved port 1 from VLAN 3 to VLAN 1. These are the commands I ran.

switch>show vlan

VLAN Name Status Ports  
———- ———– ————- ——————–  
1 default active Gi0/28  
3 server active Gi0/1, Gi0/2, Gi0/3 ….

switch> enable  
switch# config term  
switch (config)# interface Gi0/1  
switch (config-if)# switchport access vlan 1  
switch (config-if)# exit  
switch (config)# exit  
switch# show vlan

VLAN Name Status Ports  
——— ———– ————- —————  
1 default active Gi0/1, Gi0/28  
3 server active Gi0/2, Gi0/3 ….

### **Second Hurdle: Couldn’t Reach TFTP Server**

To upgrade the image, I had to put the image on a TFTP server and pull it down. Unfortunately I wasn’t able to ping my FTP server. I quickly figured out that I didn’t have an IP address for VLAN 1. To set the IP address:

switch(config)#int vlan 1  
switch(config-if)# ip address 172.16.0.10 255.255.0.0  
switch# ping 172.16.1.27

### **Finally the upgrade!**

Cisco offers a .tar and a .bin image for the upgrades. Use the .tar file if you want to use the CMS software. I just wanted to use the command line interface (CLI), so I grabbed the .bin file (c3560-ipbasek9-mz.122-44.SE.bin) and placed it on the root directory of my TFTP server.

**1. Verified that there’s enough space. The .bin file is ~8MB. In the 3560’s flash:**

switch#dir flash

<——- Tuncated except for last line ——->  
24998976 bytles total (16349184 bytes free)

Since there’s ~ 16 MB free, we’re good to go. Otherwise delete by issuing this command:

switch#delete /force /recursive flash:directory\_of\_old\_image\_here

**2. Downloaded image onto the switch and verified its integrity**

switch#copy tftp flash  
Address or name of remote host []? 172.16.1.27  
Source filename []? c3560-ipbasek9-mz.122-44.SE.bin  
Destination filename [c3560-ipbasek9-mz.122-44.SE.bin]?

switch#dir flash  
switch#verify flash:c3560-ipbasek9-mz.122-44.SE.bin

**3. Changed the boot image in the switch**

switch#show boot  
switch#configure terminal  
switch(config)#boot system flash:c3560-ipbasek9-mz.122-44.SE.bin  
switch#exit  
switch#show boot

**4. Saved, verified, and rebooted**

switch#write memory  
switch#show version  
switch#reload

Upon reboot  
switch#show ver

**5. Drank a celebratory drink. Coffee of course, because I was still at work.**