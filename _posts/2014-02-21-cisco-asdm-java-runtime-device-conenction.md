---
title: Cisco ASDM Java Runtime Device Conenction
date: 2014-02-21
layout: post
---
I have recently had a lot of issues with Cisco ASDM on new installs of Windows 7 and upwards.

After lots of research and a bit of digging I have found a way to resolve this issue.
<!--more-->

1. Install Java Runtime Environment 6 Update 7

2. Install ASDM onto the computer

3. Edit the properties it the ASDM Shortcut.

4. change the beginning of the target from:

`C:\windows\system\java.exe`

TO:

`C:\Program Files (x86)\Java\jre1.6.0_07\bin\javaw.exe`

This should resolve the issue with version 7.1(1) not connecting to devices.
