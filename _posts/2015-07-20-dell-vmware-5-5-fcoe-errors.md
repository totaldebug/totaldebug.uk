---
title: Dell VMware 5.5 FCoE Errors
date: 2015-07-20
layout: post
---
Recently I have seen an issue after upgrading some of our Dell R6xx hosts to 5.5 U2, they started showing FCoE in the storage adapters and booting took a really long time.

I looked into this and found that the latest Dell ESXi image also includes Drivers and scripts that enable the FCoE interfaces on cards that support it.

To see if you have this problem check the below steps:
<!--more-->

on boot press ALT + F12, this will show what ESXi is doing on boot, you will then begin to see the following errors multiple times:

```sh
FIP VLAN ID unavail. Retry VLAN discovery
fcoe_ctlr_vlan_request() is done
```

to resolve this issue connect via SSH to the host and run the below commands:

```sh
esxcli software vib remove -n scsi-bnx2fc
cd /etc/rc.local.d/
rm 99bnx2fc.sh
esxcli fcoe nic disable -n=vmnic4
esxcli fcoe nic disable -n=vmnic5
```

This will remove the FCoE VIB, delete a script that runs to check for the VIB and then disable fcoe on the vmnics required.

Hopefully this will help someone else as it took me a long time to find this solution and resolve the issue.
