---
id: 45
title: 'KILLING A WINDOWS SERVICE THAT SEEMS TO HANG ON &#8220;STOPPING&#8221;'
date: 2011-07-19T09:25:55+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=45
permalink: /killing-a-windows-service-that-seems-to-hang-on-stopping/
post_views_count:
  - "3228"
categories:
  - Servers
  - Windows Server
tags:
  - force
  - process
  - server
  - service
  - stopping
  - windows
---
<span style="font-family: Arial;">It sometimes happens (and it&#8217;s not a good sign most of the time): you&#8217;d like to stop a Windows Service, and when you issue the stop command through the SCM (Service Control Manager) or by using the ServiceProcess classes in the .NET Framework or by other means (net stop, Win32 API), the service remains in the state of &#8220;stopping&#8221; and never reaches the stopped phase. It&#8217;s pretty simple to simulate this behavior by creating a Windows Service in C# (or any .NET language whatsoever) and adding an infinite loop in the Stop method. The only way to stop the service is by killing the process then. However, sometimes it&#8217;s not clear what the process name or ID is (e.g. when you&#8217;re running a service hosting application that can cope with multiple instances such as SQL Server Notification Services). The way to do it is as follows:</span>  
<!--more-->

  1. <span style="font-family: Arial; "><span style="font-family: Arial; ">Go to the command-prompt and query the service (e.g. the SMTP service) by using sc:</span></span> 
    sc queryex SMTPSvc</li> 
    
      * <span style="font-family: Arial; "><span style="font-family: Arial; ">This will give you the following information:</span></span> 
        <span style="font-family: 'Courier New';">SERVICE_NAME: SMTPSvc<br /> TYPE               : 20  WIN32_SHARE_PROCESS<br /> STATE              : 4  RUNNING<br /> (STOPPABLE, PAUSABLE, ACCEPTS_SHUTDOWN)<br /> WIN32_EXIT_CODE    : 0  (0x0)<br /> SERVICE_EXIT_CODE  : 0  (0x0)<br /> CHECKPOINT         : 0x0<br /> WAIT_HINT          : 0x0<br /> PID                : 388<br /> FLAGS              :</span>
        
        or something like this (the &#8220;state&#8221; will mention stopping).</li> 
        
          * <span style="font-family: Arial; "><span style="font-family: Arial; ">Over here you can find the process identifier (PID), so it&#8217;s pretty easy to kill the associated process either by using the task manager or by using taskkill:</span></span> 
            taskkill /PID 388 /F
            
            where the /F flag is needed to force the process kill (first try without the flag).</li> </ol> 
            
            <span style="font-family: Arial;">Please be careful when you do this; it&#8217;s useful for emergencies but you shouldn&#8217;t use it on a regular basis (use it as a last chance to solve the problem or to avoid the need of a reboot in an exceptional situation). It can even be used to stop a service that has the &#8220;NOT-STOPPABLE&#8221; and/or &#8220;IGNORES_SHUTDOWN&#8221; flag set (e.g. Terminal Services on a Windows Server 2003 is non-stoppable), at least when it&#8217;s not hosted in the system process. You can query all this information by means of the sc command.</span>
            
            <span style="font-family: Arial;">For real freaks (<span style="text-decoration: underline;"><strong>don&#8217;t do this on a production machine!</strong></span>): if you want to show the behavior of the &#8220;Blaster&#8221; worm which caused the RPC service to stop, try to stop the RPC service (but safe your work first :-)). It&#8217;s pretty simple to do if you have administrative privileges (just a great example of why you should NOT run as a high-privileged user on the system). When you succeed in killing the process (pretty straightforward), you&#8217;ll see the shutdown countdown popping up (if you&#8217;ve seen Blaster in action in the past, you&#8217;ll have a deja-vu). You can stop this by typing the command shutdown -a (abort shutdown), as I posted previously in the Blaster-timeframe since this wasn&#8217;t known very well and it was quite useful to abort the started shutdown in order to apply the patch. You can even restart the service then by using sc again. Notice that if the RPC is stopped, you can&#8217;t even connect to the MMC console for the Services management (services.msc) since this relies on RPC. So, you really can&#8217;t start the service again by using the MMC snap-in. The only way to start the service again is by using sc start <servicename>. The output of this (nice but at the same time ugly) demo looks like this (<strong><span style="color: #ff0000;">again, don&#8217;t try this at home; I&#8217;m not responsible for any damage or data loss possible</span></strong>):</span>
            
            <span style="font-family: 'Courier New';">C:\Documents and Settings\Administrator>sc queryex rpcss</span>
            
            <span style="font-family: 'Courier New';">SERVICE_NAME: rpcss<br /> TYPE               : 20  WIN32_SHARE_PROCESS<br /> STATE              : 4  RUNNING<br /> (NOT_STOPPABLE, NOT_PAUSABLE, IGNORES_SHUTDOWN))</span>
            
            <span style="font-family: 'Courier New';">        WIN32_EXIT_CODE    : 0  (0x0)<br /> SERVICE_EXIT_CODE  : 0  (0x0)<br /> CHECKPOINT         : 0x0<br /> WAIT_HINT          : 0x0<br /> PID                : 2332<br /> FLAGS              :</span>
            
            <span style="font-family: 'Courier New'; ">C:\Documents and Settings\Administrator>taskkill /pid 2332 /F<br /> </span><span style="font-family: 'Courier New'; ">SUCCESS: The process with PID 2332 has been terminated.</span>
            
            C:\Documents and Settings\Administrator>shutdown /a
            
            <span style="font-family: 'Courier New'; ">C:\Documents and Settings\Administrator>sc start rpcss</span>
            
            <span style="font-family: 'Courier New'; ">SERVICE_NAME: rpcss<br /> TYPE               : 20  WIN32_SHARE_PROCESS<br /> STATE              : 2  START_PENDING<br /> (NOT_STOPPABLE, NOT_PAUSABLE, IGNORES_SHUTDOWN))</span>
            
            <span style="font-family: 'Courier New'; ">        WIN32_EXIT_CODE    : 0  (0x0)<br /> SERVICE_EXIT_CODE  : 0  (0x0)<br /> CHECKPOINT         : 0x0<br /> WAIT_HINT          : 0x7d0<br /> PID                : 2520<br /> FLAGS              :</span>
            
            <span style="font-family: 'Courier New'; ">C:\Documents and Settings\Administrator>sc queryex rpcss</span>
            
            <span style="font-family: 'Courier New'; ">SERVICE_NAME: rpcss<br /> TYPE               : 20  WIN32_SHARE_PROCESS<br /> STATE              : 4  RUNNING<br /> (NOT_STOPPABLE, NOT_PAUSABLE, IGNORES_SHUTDOWN))</span>
            
            <span style="font-family: 'Courier New'; ">        WIN32_EXIT_CODE    : 0  (0x0)<br /> SERVICE_EXIT_CODE  : 0  (0x0)<br /> CHECKPOINT         : 0x0<br /> WAIT_HINT          : 0x0<br /> PID                : 2520<br /> FLAGS              :</span>
            
            <span style="font-family: Arial; ">If you decide to try it (ignoring my warnings), don&#8217;t rely on the system afterwards since various applications will have suffered from this. I&#8217;m experimenting with these things myself only on a Virtual PC with undo disks enabled.</span>
            
            <span style="font-family: Arial; ">To go short: sc is one of my favorite commands to mess around with services (install, uninstall, etc) and to query for information on services. The sc command can also be used to query all the active drivers on the system. If you don&#8217;t like system-beeps for example, you can use sc stop Beep to stop the according driver. But please again, be careful when you play with it. Fortunately, disastrous driver stoppings are not possible and will be denied by sc.</span>
            
            <span style="font-family: Arial; ">More info on sc.exe can be found via <a href="http://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/sc.mspx">http://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/sc.mspx</a></span>