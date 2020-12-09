---
id: 5960
title: Synchronise time with external NTP server on Windows Server
date: 2011-07-08T12:52:25+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=5
permalink: /synchronize-time-with-external-ntp-server-on-windows-server/
post_views_count:
  - "3134"
  - "3134"
categories:
  - Windows Server
tags:
  - External
  - ntp
  - pool
  - server
  - synchronise
  - windows
---
Time synchronization is an important aspect for all computers on the network. By default, the clients computers get their time from a Domain Controller and the Domain Controller gets his time from the domain’s PDC Operation Master. Therefore the PDC must synchronize his time from an external source. I usually use the servers listed at the <a title="NTP Pool Project" href="http://www.pool.ntp.org/" target="_blank">NTP Pool Project </a>website. Before you begin, don’t forget to open the default UDP 123 port (in- and outbound) on your firewall.<!--more-->

  1. First, locate your PDC Server. Open the command prompt and type:  
    <em style="font-weight: bold;">[crayon lang=&#8217;cmd&#8217;]C:\>netdom /query fsmo[/crayon]</em>
  2. Log in to your PDC Server and open the command prompt.
  3. run the following command:  
    <em style="font-weight: bold;">[crayon lang=&#8217;cmd&#8217;]net stop w32time[/crayon]</em>
  4. Configure the external time sources, type: [crayon lang=&#8217;cmd&#8217;]w32tm /config /manualpeerlist:&#8221;0.pool.ntp.org 1.pool.ntp.org 2.pool.ntp.org&#8221;,0x8 /syncfromflags:MANUAL[/crayon]
  5. run the following command  
    <em style="font-weight: bold;">[crayon lang=&#8217;cmd&#8217;]net start w32time[/crayon]</em>
  6. Re sync the time services, type: [crayon lang=&#8217;cmd&#8217;]w32tm /resync /nowait[/crayon]
  7. To check that the command has worked run the following: [crayon lang=&#8217;cmd&#8217;]**_w32tm /query /configuration_**[/crayon]

**NOTE:** when doing this on SBS you may get an access denied error if you do remove: /reliable:yes from the line on number 3.