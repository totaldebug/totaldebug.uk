---
id: 6178
title: 'UniFi L2TP: set a static IP for a specific user (built-in Radius Server)'
date: 2019-10-07T12:56:22+00:00
author: marksie1988
layout: post
guid: http://spottedhyena.co.uk/?p=6178
permalink: /unifi-l2tp-set-a-static-ip-for-a-specific-user-built-in-radius-server/
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
ct_author_last_updated:
  - default
categories:
  - Ubiquiti
tags:
  - config
  - controller
  - l2tp
  - static ip
  - ubiquiti
  - unifi
  - usg
  - usw
  - vpn
---
When using my L2TP VPN with the Unifi I realised that it was assigning a different IP Address to my client when it connected sometimes.

This wouldn&#8217;t normally be a problem if the remote client was only taking to my internal network, however I run a server that my internal network communicates out to via IP Address, so if this changes it all stops working.

This article walks through how to setup a static IP Address for an L2TP Client.

<!--more-->

First we need to get a dump of our configuration from the USG, to do this we need to SSH to the USG and run a dump:

<pre class="lang:sh decode:true">mca-ctrl -t dump-cfg</pre>

Once we have this I recommend copying it into your favorite text editor. We want to delete everything except the following:

<pre class="lang:default decode:true ">{
        "service": {
                "radius-server": {
                        "user": {
                                "myl2tpuser": {
                                        "password": "password",
                                        "tunnel-param": "3 1"
                                }
                        }
                }
        }
        
}</pre>

Now that we only have our user configuration we need to modify it to assign the IP Address:

<pre class="lang:default decode:true ">{
        "service": {
                "radius-server": {
                        "user": {
                                "myl2tpuser": {
                                        "ip-address": "192.168.10.10"
                                }
                        }
                }
        }   
}</pre>

Once we have this we are able to add this to a config file on our controller which, when the controller re-provisions the USG will apply. (you can also manually force a provision)

The file needs to be saved to the site location, this will be something similar to:

<pre class="lang:default decode:true ">/opt/UniFi/data/sites/default/</pre>

once in this directory create a new file called &#8220;config.gateway.json&#8221; and paste the above configuration into it.

To test the new configuration file you can run this command:

<pre class="lang:default decode:true ">python -m json.tool config.gateway.json</pre>

you shouldn&#8217;t see any errors if this is correct.

We now can re-provision the USG which will pickup the configuration from the Controller and update the VPN settings.