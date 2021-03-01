---
title: Offline Upgrade ESXi 5.5 to 6.0
date: 2015-03-15
layout: post
---
This is a very short and sweet article documenting the offline upgrade process from 5.5 to 6.0
<!--more-->

1. Download the ESXi 6.0 Offline Bundle from the VMware website.
2. Upload the file to the local datastore of the ESXi Host.
3. Enable SSH on the ESXi Host
4. Connect to the ESXi Host and run the below command:

```sh
esxcli storage filesystem list
```

5. you should now have a list of your datastores, copy the mount point and add it to the below command:

```sh
esxcli software vib install -d <path_to_bundle.zip>
```

6. wait until the upgrade has completed then enter the follwoing to reboot the host:

```sh
reboot
```

The host will reboot and you will now be able to connect with your client, you will be prompted to download the latest client and then you will be away!
