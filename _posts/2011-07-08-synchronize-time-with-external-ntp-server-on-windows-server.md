---
title: Synchronise time with external NTP server on Windows Server
date: 2011-07-08 10:15:00 +0100
categories: [Windows]
tags: [ntp, time, sync, windows, server]
---

Time synchronization is an important aspect for all computers on the network. By default, the clients computers get their time from a Domain Controller and the Domain Controller gets his time from the domain’s PDC Operation Master. Therefore the PDC must synchronize his time from an external source. I usually use the servers listed at the <a title="NTP Pool Project" href="http://www.pool.ntp.org/" target="_blank">NTP Pool Project </a>website. Before you begin, don’t forget to open the default UDP 123 port (in- and outbound) on your firewall.<!--more-->

First, locate your PDC Server. Open the command prompt and type:

```shell
netdom /query fsmo
```

Log in to your PDC Server and open the command prompt.
run the following command:

```shell
net stop w32time
```

Configure the external time sources, type:

```shell
w32tm /config /manualpeerlist:&#8221;0.pool.ntp.org 1.pool.ntp.org 2.pool.ntp.org&#8221;,0x8 /syncfromflags:MANUAL
```

run the following command:

```shell
net start w32time
```

Re sync the time services, type:

```shell
w32tm /resync /nowait
```

To check that the command has worked run the following:

```shell
**_w32tm /query /configuration_**
```

> When doing this on SBS you may get an access denied error if you do remove: /reliable:yes from the line on number 3.
{: .prompt-info }
