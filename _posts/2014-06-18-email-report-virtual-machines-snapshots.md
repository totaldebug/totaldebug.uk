---
title: 'Email Report Virtual Machines with Snapshots'
date: 2014-06-18
layout: post
---
I have recently had an issue with people leaving snapshots on VM's for too long causing large snapshots and poor performance on Virtual Machines.

I decided that I needed a way of reporting on which virtual machines had snapshots present, when they were created and how big they are.
<!--more-->

The attached PowerCLI script does just that! It will logon to vCenter check all of the virtual machines for snapshots and then send an email report to the email address specified.

> This script support's the `get-help` command and tab completion of parameters.
{: .prompt-info }

[Get-VMSnapshotReport](https://raw.githubusercontent.com/SpottedHyenaUK/VMwareScripts/master/Get-VMSnapshotReport.ps1)

To use this script simply use the following commands:

```powershell
./Get-VMSnapShotReport.ps1 -vCenter "my.vcenter.com" -user username -password YourPassword  -OlderThan 48 -EmailTo "user@domain.com" -EmailFrom "user@domain.com" -EmailSubject "My Snapshot Report" -EmailServer "mail.domain.com"
```

The only thing that I ask is that when using this script you keep my name and website present in the notes, if there are any improvements you think I could make please let me know.
