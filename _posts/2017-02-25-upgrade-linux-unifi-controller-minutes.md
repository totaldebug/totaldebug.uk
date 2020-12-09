---
id: 1779
title: Upgrade your Linux UniFi Controller in minutes!
date: 2017-02-25T21:03:16+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=1779
permalink: /upgrade-linux-unifi-controller-minutes/
post_views_count:
  - "227"
voted_IP:
  - 'a:1:{s:10:"92.97.30.5";i:1492521580;}'
  - 'a:1:{s:10:"92.97.30.5";i:1492521580;}'
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
categories:
  - Ubiquiti
tags:
  - bash
  - centos
  - controller
  - linux
  - script
  - ubiquiti
  - unifi
  - upgrade
---
Ubiquiti&#8217;s provide a Controller version for other distributions of linux but only display debian on their site, but if you’re running CentOS or another Linux distribution, you’ll have to use the generic controller package. The upgrade provess is so simple! (i have also written <a href="https://raw.githubusercontent.com/SpottedHyenaUK/BashScripts/master/CentOS_UniFi_Controller_Upgrade.sh" target="_blank" rel="noopener noreferrer">this</a> script that makes it even quicker)

I previously explained how to install your own [UniFi Controller on CentOS in this article](http://35.176.61.220/install-unifi-controller-centos-7/). Once you have it up and running, it’s even easier to upgrade to a newer version. The process takes less than 3 minutes with these steps.

<!--more-->

This upgrade was tested on version 5.3.11 to 5.4.11 but should be the same for all versions

UPDATE: I have also upgraded 5.4.11 to 5.5.11 with no issues

Stop the UniFi Controller service:

<pre class="lang:default decode:true ">systemctl stop unifi</pre>

Take a backup of the current unifi folder:

<pre class="lang:default decode:true">cp -R /opt/UniFi/ /opt/UniFi_bak/</pre>

Download the new version:

<pre class="lang:default decode:true ">cd ~ && wget http://dl.ubnt.com/unifi/5.4.11/UniFi.unix.zip</pre>

Unzip the downloaded file into the correct directory:

<pre class="lang:default decode:true ">unzip -q UniFi.unix.zip -d /opt</pre>

Copy the old data back into the UniFi folder, this allows historical data to be kept:

<pre class="lang:default decode:true ">cp -R /opt/UniFi_bak/data/ /opt/UniFi/data/</pre>

Restart the UniFi Controller service:

<pre class="lang:default decode:true ">systemctl start unifi</pre>

Wait a little while for your controller to load back up, once completed you can login as normal and you should still have all your legacy data still visible.

thats it youre done, simple!