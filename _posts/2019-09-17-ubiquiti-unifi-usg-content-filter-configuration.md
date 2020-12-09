---
id: 6107
title: Ubiquiti UniFi USG Content Filter Configuration
date: 2019-09-17T19:21:34+00:00
author: marksie1988
layout: post
guid: http://spottedhyena.co.uk/?p=6107
permalink: /ubiquiti-unifi-usg-content-filter-configuration/
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
  - content filter
  - content filtering
  - ubiquiti
  - ubnt
  - unifi
  - usg
---
Recently I had a requirement to setup a content filter on the USG for a client. I couldn&#8217;t find much information online so have decided to write this article to show others how to do this

First we need to logon to the USG via SSH, On windows i recommend [Putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)

Once we have logged in, run the below command:

<pre class="lang:default decode:true">update webproxy blacklists</pre>

<span style="font-size: 14px;"><em>This will download all of the content filter categories to the USG, this can take some time as there is aprox 100MB (70-80MB is &#8220;adult&#8221;)</em></span>

When this is completed run the following:

<pre class="lang:default decode:true ">configure
set service webproxy url-filtering squidguard block-category &lt;insert caregory&gt;</pre>

<span style="font-size: 14px;"><em>This will set the categories that you wish to block, repeating the command will add more categories. pressing ? will display a list of all available categories</em></span>

We now need to set the web proxy listener address for the network we wish to filter:

<pre class="lang:default decode:true">set service webproxy listen-address &lt;-usg-lan-ip-&gt;</pre>

You are also able to set a redirect URL:

<pre class="lang:default decode:true ">set service webproxy url-filtering squidguard redirect-url &lt;url&gt;</pre>

<span style="font-size: 14px;"><em>The redirect url is google.com by default, however you could create a custom &#8220;Blocked Website&#8221; page to make users aware.</em></span>

Now we need to commit these changes to the USG:

<pre class="lang:default decode:true ">commit</pre>

The below example shows how we set this up on the network 10.10.10.1/24

<pre class="lang:default decode:true">configure
set service webproxy url-filtering squidguard block-category adult
set service webproxy listen-address 10.10.10.1
set service webproxy url-filtering squidguard redirect-url spottedhyena.co.uk
commit</pre>

To make this a permenant change you can create a configuration file on the controller, run the command:

<pre class="lang:default decode:true ">mca-ctrl -t dump-cfg</pre>

Find the &#8220;service&#8221; section and delete all content other than the webproxy, it should looks similar to below:

<pre class="lang:default decode:true">"service": {
        "webproxy": {
                "cache-size": "0",
                "default-port": "3128",
                "listen-address": {
                        "10.10.10.1": "''"
                },
                "mem-cache-size": "5",
                "url-filtering": {
                        "squidguard": {
                                "block-category": [
                                        "adult"
                                ],
                                "default-action": "allow",
                                "redirect-url": "http://spottedhyena.co.uk"
                        }
                }
        }
}</pre>

Save this information into a file on your controller

  * File Location: /opt/UniFi/data/sites/[site name/default]/
  * File Name: config.gateway.json

once you have done this whenever you make any changes to your USG the Content Filtering will be re-applied.

Hopefully this article has assisted you with your configuration. Any questions please let me know.