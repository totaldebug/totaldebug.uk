---
id: 512
title: Graylog2 Cisco ASA / Cisco Catalyst
date: 2015-01-21T10:08:27+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=512
permalink: /graylog2-cisco-asa-cisco-catalyst/
post_views_count:
  - "4784"
voted_IP:
  - 'a:16:{s:13:"58.26.117.226";i:1425441657;s:11:"5.226.81.18";i:1434962470;s:14:"217.74.109.186";i:1440171280;s:15:"192.101.174.126";i:1441731025;s:14:"197.218.82.215";i:1442096420;s:13:"50.73.188.106";i:1443492931;s:12:"12.200.212.2";i:1446219169;s:11:"85.188.73.3";i:1454683565;s:11:"81.23.57.44";i:1455106119;s:15:"197.155.136.141";i:1460670129;s:15:"212.170.103.137";i:1462894538;s:15:"159.180.236.163";i:1464618582;s:14:"198.180.147.53";i:1474398223;s:14:"186.221.72.105";i:1477578230;s:14:"12.220.104.131";i:1478195677;s:12:"38.112.41.52";i:1486496003;}'
votes_count:
  - "16"
xyz_fbap:
  - "1"
categories:
  - Graylog2
tags:
  - asa
  - cisco
  - cisco asa
  - extractor
  - graylog2
  - input
---
In order to correctly log Cisco device in Graylog2 setup the below configuration.  
<!--more-->

This has now been added to the Graylog Marketplace <a href="https://marketplace.graylog.org/addons/90396261-812c-4fa8-ad8f-a17771c9f8e0" target="_blank">https://marketplace.graylog.org/</a>

Cisco ASA Configuration: 

<pre class="lang:default decode:true " >logging enable
logging trap informational
logging asdm informational
logging device-id hostname
logging host &lt;network&gt; &lt;ip-address&gt; &lt;udp-tcp&gt;/&lt;port&gt;</pre>

Create a Raw/PlainText input with the settings you require. 

Then select action -> Manage Extractors.

Now select actions -> Import Extractors, in the box add the below configuration. This will format the messages correctly with the IP Address of the firewall as the source.

If you would like the Source to be the IP Address Change this line: 

<pre class="lang:default decode:true " >"regex_value": ">(.+?)%"</pre>

To this:

<pre class="lang:default decode:true " >"regex_value": "&gt;: (.+?):"</pre>

<pre class="lang:default decode:true " data-url="https://raw.githubusercontent.com/SpottedHyenaUK/Graylog-Cisco-ASA-Extractor/master/Cisco-ASA-Extractor.json" ></pre>