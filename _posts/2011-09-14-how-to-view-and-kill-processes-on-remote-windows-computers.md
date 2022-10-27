---
title: How To View and Kill Processes On Remote Windows Computers
date: 2011-09-14 09:00:00 +0100
categories: [Windows]
tags: [task, kill, taskkill, process, remote]
---
Windows provides several methods to view processes remotely on another computer. Terminal Server is one way or you can use the command line utility pslist from Microsoft Sysinternals site. While both options are good alternatives, Windows XP and Vista provides a built in utility for viewing and killing process on remote Computers using Tasklist and Taskkill commands.
<!--more-->

Both tasklist.exe and taskkill,exe can be found in %SYSTEMROOT%\System32 (typically C:\Windows\System32) directory.

To view processes on a remote Computer in your home, you will need to know the username and password on the Computer you want to view the processes. Once you have the user account information, the syntax for using _tasklist_ follows:

```cmd
_tasklist.exe /S SYSTEM /U USERNAME /P PASSWORD_
```

(To view all tasklist options, type _tasklist /?_ at the command prompt)

To execute, click on _Start \ Run…_ and in the run window type _cmd_ to open a command prompt. Then type the tasklist command, substituting **_SYSTEM_** for the remote computer you want to view processes, **_USERNAME_** and **PASSWORD** with an account/password on the remote Computer.

> _if you are in a Domain environment and have Administrator rights to the remote Computer, you will may not need to specify a Username and Password_
{: .prompt-info }
