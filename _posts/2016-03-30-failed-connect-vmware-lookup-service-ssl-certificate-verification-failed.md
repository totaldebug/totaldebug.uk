---
title: Failed to connect to VMware Lookup Service, SSL certificate verification failed
date: 2016-03-30
layout: post
---
Recently I have been playing in my lab with VCSA and vCNS, I found that when I tried to connect to the vCenter I received this error:

```sh
Failed to connect to VMware Lookup Service.
SSL certificate verification failed.
```

<!--more-->

I was stuck for a little while as to why I was getting this error, then I noticed that the SSL Cert had a different name to the appliance due to it being deployed and then renamed. Lucky for me the fix for this is very simple!

  * Go to http://<vcenter>:5480
  * Click the &#8220;Admin&#8221; tab
  * Change &#8220;Certificate regeneration enalbed&#8221; to yes, this is either done with a toggle button to the right or radio button depending on the VCSA Version.
  * Restart the vCenter Appliance
  * Once the Appliance reboots it will re-generate the certificates
  * Change &#8220;Certificate regeneration enalbed&#8221; to no, this is either done with a toggle button to the right or radio button depending on the VCSA Version.

try to reconnect your appliance / application to vCenter and it should work no problems.
