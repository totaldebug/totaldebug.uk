---
title: 'The Missing Manual Part 1: Veeam B & R Direct SAN Backups'
date: 2011-07-22
layout: post
---
One thing that I had problems with the first time I installed Veeam was the ability to backup Virtual Machines directly from the SAN. Meaning that instead of proxying the data through an ESXi host, the data would flow from SAN to backup server directly. The benefits of this process are very clear… reduced CPU and network load on the ever so valuable ESXi resources.
<!--more-->

The problem is that by default this just doesn’t work with Veeam if you haven’t properly setup your backup server. I will try and keep this process simple, and vendor agnostic ( from a SAN point of view).

The first step to making the vStorage API “SAN backup” work is to make sure your backup server has the Microsoft iSCSI initiator installed. It is already installed by default on Windows 2008 server, however for windows 2003 server you will need to go to Microsoft to [download](http://www.microsoft.com/downloads/details.aspx?familyid=12cb3c1a-15d6-4585-b385-befd1319f825&displaylang=en) the latest version.

> You will need to configure your SAN to allow the IQN address of the iSCSI initiator to have access to the volumes on the SAN… this process is different for each vendor. See screen shot on how to find this in the Configuration tab of the iscsi initiator
{: .prompt-info }

After installing MS iSCSI initiator, and setting up your SAN, we need to configure it to see the SAN volumes; do this by opening the “iSCSI initiator” option from control panel. At the top of the main tab there is a field where you can put your SAN’s IP address, enter that now and then press Quick Connect. Shortly a list of all of the volumes that your backup server has access to should appear, once they do select each one and press the “connect” button. Because the volumes are formatted VMFS windows will not show them in My Computer, but if you go to Disk Management inside of Computer manager you should now see that the backup server can see these volumes.

**Update: A note from the Veeam Team** “One thing that we (Veeam) recommends is to disable automount on your Windows backup server. To do this open up a command prompt and enter in diskpart. Hit enter and then type “Automount disable”. This is to ensure that the Windows server doesn’t try and format the volumes at all. However, before any of this is done if you can through your SAN software, give the Veeam Backup server Read-Only access to your VMFS volumes.”

After preforming these steps go ahead and configure Veeam to use the SAN backup option, and you should notice (especially if you have separate NICs for the SAN network) that all of your data is moving through the SAN directly to the backup server without proxying through the ESXi hosts.
