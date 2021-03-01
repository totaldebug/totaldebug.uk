---
title: Killing a Windows service that hangs on "stopping"
date: '2011-07-19'
layout: post
---
It sometimes happens (and it's not a good sign most of the time): you'd like to stop a Windows Service, and when you issue the stop command through the SCM (Service Control Manager) or by using the ServiceProcess classes in the .NET Framework or by other means (net stop, Win32 API), the service remains in the state of `stopping` and never reaches the stopped phase. It's pretty simple to simulate this behavior by creating a Windows Service in C# (or any .NET language whatsoever) and adding an infinite loop in the Stop method. The only way to stop the service is by killing the process then. However, sometimes it's not clear what the process name or ID is (e.g. when you're running a service hosting application that can cope with multiple instances such as SQL Server Notification Services). The way to do it is as follows:

1. Go to the command-prompt and query the service (e.g. the SMTP service) by using sc:
  ```
  sc queryex SMTPSvc
  ```
      * This will give you the following information:

       >SERVICE_NAME: SMTPSvc
        TYPE               : 20  WIN32_SHARE_PROCESS
        STATE              : 4  RUNNING
        (STOPPABLE, PAUSABLE, ACCEPTS_SHUTDOWN)
        WIN32_EXIT_CODE    : 0  (0x0)
        SERVICE_EXIT_CODE  : 0  (0x0)
        CHECKPOINT         : 0x0
        WAIT_HINT          : 0x0
        PID                : 388
        FLAGS              :

        or something like this (the state will mention stopping).

      * Over here you can find the process identifier (PID), so it's pretty easy to kill the associated process either by using the task manager or by using taskkill:
        ```
        taskkill /PID 388 /F
        ```
      where the /F flag is needed to force the process kill (first try without the flag).</li> </ol>
