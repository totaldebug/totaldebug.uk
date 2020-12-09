---
id: 69
title: Mapping a network drive in NT4 with logon credentials
date: 2011-07-28T09:20:55+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=69
permalink: /mapping-a-network-drive-in-nt4-with-logon-credentials/
post_views_count:
  - "3039"
categories:
  - NT 4
tags:
  - credentials
  - drive
  - logon
  - network
  - NT4
---
Ok so today I had a customer come to me saying that when they map a network drive in NT4 the user details don&#8217;t get remembered when the pc is rebooted.

Here is a simple solution to the issue we have been having:

[crayon lang=&#8221;cmd&#8221;]net use I: \\SERVERNAME\SHARENAME /User:DOMAIN\username password[/crayon]

run this at startup or as a logon script and the issue will be no more.