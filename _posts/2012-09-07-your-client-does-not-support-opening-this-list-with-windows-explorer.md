---
title: Your client does not support opening this list with windows explorer
date: 2012-09-07
layout: post
---
When using Office 365 and sharepoint 2010 you may find that trying to open a library in explorer will result in this error:

&#8220;Your client does not support opening this list with windows explorer&#8221;

I have written a few simple things to check and once these are met the issue should be resolved.
<!--more-->

There are a few things to check:

  1. Use IE x86 not x64.
  2. Make sure the URL is in the trusted sites list within internet options and security.
  3. If it is Windows Server make sure Desktop Experience is installed.
  4. Make sure the WebClient service is started.

If all of these things are met then your issue should now be resolved.
