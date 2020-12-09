---
id: 681
title: Add vCenter Logs to Syslog Server (GrayLog2)
date: 2015-07-06T10:38:50+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=681
permalink: /add-vcenter-logs-to-syslog-server-graylog2/
post_views_count:
  - "2046"
xyz_fbap:
  - "1"
xyz_lnap:
  - "1"
xyz_twap:
  - "1"
voted_IP:
  - 'a:1:{s:15:"109.192.155.164";i:1484258399;}'
  - 'a:1:{s:15:"109.192.155.164";i:1484258399;}'
  - 'a:1:{s:15:"109.192.155.164";i:1484258399;}'
votes_count:
  - "1"
  - "1"
  - "1"
categories:
  - Graylog2
  - VMware
tags:
  - gelf
  - graylog2
  - nxlog
  - syslog
  - vcenter
  - vpxd
---
In this article I will be showing you how to add vCenter logs to a syslog server, I currently use GrayLog2 as its a great free syslog server and does everything that I require.  
<!--more-->

First we want to install <a href="http://nxlog.org" target="_blank">NxLog</a> on our vCenter Server, This will be our syslog client. 

To configure NxLog go to: c:\Program Files (x86)\nxlog\conf and edit nxlog.conf with a word editor. 

Add the following configuration into the file: 

<pre class="lang:default decode:true " >define ROOT C:\Program Files (x86)\nxlog

Moduledir %ROOT%\modules
CacheDir %ROOT%\data
Pidfile %ROOT%\data\nxlog.pid
SpoolDir %ROOT%\data
LogFile %ROOT%\data\nxlog.log

&lt;Extension gelf&gt;
    Module      xm_gelf
&lt;/Extension&gt;

&lt;Input EventLog_In&gt;
    Module	im_msvistalog
# For windows 2003 and earlier use the following:
#   Module      im_mseventlog
&lt;/Input&gt;
&lt;Input Vpxd_In&gt;
    Module	im_file
    File	"C:\\ProgramData\\VMware\\VMware VirtualCenter\\Logs\\vpxd-*.log"
    SavePos      TRUE
    Exec	$Hostname = 'myserver.local.com';
    Exec	if $raw_event =~ /\s([a-z]+)\s/ { 	\
			$Severity = $1;			\
		}
    Exec	if $raw_event =~ /\'([a-zA-Z\.]+)\'/ { 	\
			$Component = $1;		\
		}
    Exec	$FileName = file_name();
    Exec	$SourceName = 'vCenter VPXD';
&lt;/Input&gt;

&lt;Output EventLog_Out&gt;
    Module      om_udp
    Host        192.168.88.30
    Port        60001
    OutputType	GELF
&lt;/Output&gt;
&lt;Output Vpxd_Out&gt;
    Module      om_udp
    Host        192.168.88.30
    Port        60002
    OutputType	GELF
&lt;/Output&gt;

&lt;Route 1&gt;
    Path        EventLog_In =&gt; EventLog_Out
&lt;/Route&gt;
&lt;Route 2&gt;
    Path	Vpxd_In =&gt; Vpxd_Out
&lt;/Route&gt;</pre>

If you don&#8217;t want to log EventLogs to the Syslog Server just remove route 1 from the file or place # before each line. 

The Config Explained: 

The below code will load the module for Gelf communications, if you didn&#8217;t want to use gelf this could be changed to syslog. 

<pre class="lang:default decode:true " >&lt;Extension gelf&gt;
    Module      xm_gelf
&lt;/Extension&gt;</pre>

We then set our inputs, inputs provide information that we want to log to our syslog server, they are then translated by nxlog into a format that our syslog server will understand. As you can see from the code the EventLog is quite simple as there is a plugin specifically for this, but for vCenter Log Files we need to use the im\_file module that will allow us to parse a text log file, we can then specify custom parameters to meet our requirements, i have included hostname, message, filename and sourcename but you could also split the $raw\_event (your raw data) and log many more fields if required. 

<pre class="lang:default decode:true " >&lt;Input EventLog_In&gt;
    Module	im_msvistalog
# For windows 2003 and earlier use the following:
#   Module      im_mseventlog
&lt;/Input&gt;
&lt;Input Vpxd_In&gt;
    Module	im_file
    File	"C:\\ProgramData\\VMware\\VMware VirtualCenter\\Logs\\vpxd-*.log"
    SavePos      TRUE
    Exec	$Hostname = 'myserver.local.com';
    Exec	if $raw_event =~ /\s([a-z]+)\s/ { 	\
			$Severity = $1;			\
		}
    Exec	if $raw_event =~ /\'([a-zA-Z\.]+)\'/ { 	\
			$Component = $1;		\
		}
    Exec	$FileName = file_name();
    Exec	$SourceName = 'vCenter VPXD';
&lt;/Input&gt;</pre>

We then set where each log should be sent, as you can see i have a different output for each log type, you don&#8217;t need to do this but it makes it easier to see what is logging where in GrayLog2. You should only need to change the host to your syslog server and the port to your port (default 514) I change mine as each type of log has its own port. 

<pre class="lang:default decode:true " >&lt;Output EventLog_Out&gt;
    Module      om_udp
    Host        192.168.88.30
    Port        60001
    OutputType	GELF
&lt;/Output&gt;
&lt;Output Vpxd_Out&gt;
    Module      om_udp
    Host        192.168.88.30
    Port        60002
    OutputType	GELF
&lt;/Output&gt;</pre>

The Route tells NxLog which output to send inputs to. In my example I have 2 routes the 1st one tells the eventlogs\_in to be sent to eventlogs\_out and the 2nd does the same but for the VPXD logs, you could use one route if you were only having one output by using a comma to seperate vpxd\_in and eventlog\_in (e.g. EventLog\_in,VPXD\_In => MyCustom_Out)

<pre class="lang:default decode:true " >&lt;Output EventLog_Out&gt;
    Module      om_udp
    Host        10.255.0.38
    Port        60001
    OutputType	GELF
&lt;/Output&gt;
&lt;Output Vpxd_Out&gt;
    Module      om_udp
    Host        10.255.0.38
    Port        60002
    OutputType	GELF
&lt;/Output&gt;</pre>

Once this configuration has been completed we need to configure an output in GrayLog2 for each of our NxLog outputs, My example just shows how to do this for the VPXD log but it is the same for any log. 

  * Login to GrayLog2 Web Interface
  * Go To System > Inputs
  * Select GELF UDP from the dropdown
  * Click Launch New Input
  * Tick Global Input or a specific GrayLog2 Server depending on your setup
  * Enter a Title e.g. VPXD Logs
  * Enter a port that you specified in the NxLog configuration (this must be unique)
  * Click Launch

You should now start to see the logs pouring in, vCenter does generate a LOT of logs so you may want to keep an eye on your syslog server as it could get overloaded with data. 

Hope this helped you, any issues or questions please let me know in the comments 

Steve