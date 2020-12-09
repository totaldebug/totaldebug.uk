---
id: 1768
title: Setup Ubiquiti UniFi USG Remote User VPN
date: 2017-02-03T17:20:22+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=1768
permalink: /setup-ubiquiti-unifi-usg-remote-user-vpn/
post_views_count:
  - "444"
voted_IP:
  - 'a:1:{s:14:"162.223.101.90";i:1492011800;}'
  - 'a:1:{s:14:"162.223.101.90";i:1492011800;}'
votes_count:
  - "1"
  - "1"
slide_template:
  - default
audio_mp3:
  - ""
audio_ogg:
  - ""
audio_embed:
  - ""
video_mp4:
  - ""
video_ogv:
  - ""
video_webm:
  - ""
video_embed:
  - ""
video_poster:
  - ""
link_url:
  - ""
status_author:
  - ""
quote_author:
  - ""
featured_media:
  - 'true'
image: https://spottedhyena.co.uk/wp-content/uploads/2017/02/usg.jpg
categories:
  - Ubiquiti
tags:
  - remote
  - ubiquiti
  - unifi
  - user
  - usg
  - vpn
---
I have recently had loads of trouble setting up a Ubiquiti UniFi USG remote user VPN, the USG requires a RADIUS server in order to function correctly, the following article covers this setup <a href="http://35.176.61.220/install-freeradius-centos-7-with-daloradius-for-management/" target="_blank">freeRADIUS Setup</a>

Once RADIUS is setup the easy part is configuring the USG through the UniFi controller.  
<!--more-->

  1. First you will need to login to your UniFi Controller
  2. Go to the settings   
<img src="http://35.176.61.220/wp-content/uploads/2017/02/unifi_controller_settings.png" alt="" height="10" /> 
  3. Then select networks
  4. Create a new network
  5. Add a name for the VPN
  6. Select &#8220;Remote USer VPN&#8221; for the Purpose
  7. Enter and IP Address with CIDR e.g. 192.168.10.1/24
  8. Enter the IP Address for your RADIUS Server
  9. Enter the port for your RADIUS Server (Default is 1812)
 10. Enter your RADIUS Servers Secret Key / Password
 11. Click Save

That is all you need to do! 

NOTE: In version 5.3.11 and below P2TP is not supported which means it will not work with iPhones / iPads etc. this is supposed to be resolved in the next release, i will update this article when that happens.