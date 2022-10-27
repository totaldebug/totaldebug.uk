---
title: Setup Ubiquiti UniFi USG Remote User VPN
date: 2017-02-03 17:20:22 +00:00
image:
  name: usg.jpg
categories: [Networking, Unifi]
tags: [remove, ubiquiti, unifi, user, usg, vpn]
---

I have recently had loads of trouble setting up a Ubiquiti UniFi USG remote user VPN, the USG requires a RADIUS server in order to function correctly, the following article covers this setup [freeRADIUS Setup](https://totaldebug.uk/posts/install-freeradius-centos-7-with-daloradius-for-management/)

Once RADIUS is setup the easy part is configuring the USG through the UniFi controller.
<!--more-->

  1. First you will need to login to your UniFi Controller
  2. Go to the settings 
  3. Then select networks
  4. Create a new network
  5. Add a name for the VPN
  6. Select **Remote User VPN** for the Purpose
  7. Enter and IP Address with CIDR e.g. 192.168.10.1/24
  8. Enter the IP Address for your RADIUS Server
  9. Enter the port for your RADIUS Server (Default is 1812)
 10. Enter your RADIUS Servers Secret Key / Password
 11. Click Save

That is all you need to do!

> In version 5.3.11 and below P2TP is not supported which means it will not work with iPhones / iPads etc. this is supposed to be resolved in the next release.
{: .prompt-info }
