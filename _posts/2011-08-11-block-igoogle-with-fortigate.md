---
id: 84
title: Block iGoogle with Fortigate
date: 2011-08-11T13:02:10+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=84
permalink: /block-igoogle-with-fortigate/
post_views_count:
  - "3037"
  - "3037"
categories:
  - Fortigate
---
Ok so i had a customer that wanted to block iGoogle but allow google which turns out to be tricky as the only way to tell the difference is by the gadgets and the title bar.  
i tried to do some research about iGoogle: every sites of iGoogle what I tested has the same title in html source code. Exactly: <title>iGoogle</title>

So you can use DLP sensor to detect this title in http request and block this sites. I have tested this on a FortiGate-60B with 4.2.3 version of firmware.

[<img loading="lazy" class="alignnone size-full wp-image-85" title="01" src="http://35.176.61.220/wp-content/uploads/2011/08/01.jpg" alt="" width="500" height="400" />](http://35.176.61.220/wp-content/uploads/2011/08/01.jpg)  
I tried to solve this problem over application control, web content filter and FortiGuard web filter but I didnt find solution here.