---
title: Mapping a network drive in NT4 with logon credentials
date: 2011-07-28
layout: post
---
Ok so today I had a customer come to me saying that when they map a network drive in NT4 the user details don&#8217;t get remembered when the pc is rebooted.

Here is a simple solution to the issue we have been having:

[crayon lang=&#8221;cmd&#8221;]net use I: \\SERVERNAME\SHARENAME /User:DOMAIN\username password[/crayon]

run this at startup or as a logon script and the issue will be no more.
