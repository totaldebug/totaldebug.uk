---
title: Add vCenter Logs to Syslog Server (GrayLog2)
date: 2015-07-06
layout: post
---
In this article I will be showing you how to add vCenter logs to a syslog server, I currently use GrayLog2 as its a great free syslog server and does everything that I require.
<!--more-->

First we want to install [NxLog](http://nxlog.org) on our vCenter Server, This will be our syslog client.

To configure NxLog go to: `c:\Program Files (x86)\nxlog\conf` and edit `nxlog.conf` with a word editor.

Add the following configuration into the file:

```shell
define ROOT C:\Program Files (x86)\nxlog

Moduledir %ROOT%\modules
CacheDir %ROOT%\data
Pidfile %ROOT%\data\nxlog.pid
SpoolDir %ROOT%\data
LogFile %ROOT%\data\nxlog.log

<Extension gelf>
    Module      xm_gelf
</Extension>

<Input EventLog_In>
    Module	im_msvistalog
# For windows 2003 and earlier use the following:
#   Module      im_mseventlog
</Input>
<Input Vpxd_In>
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
</Input>

<Output EventLog_Out>
    Module      om_udp
    Host        192.168.88.30
    Port        60001
    OutputType	GELF
</Output>
<Output Vpxd_Out>
    Module      om_udp
    Host        192.168.88.30
    Port        60002
    OutputType	GELF
</Output>

<Route 1>
    Path        EventLog_In => EventLog_Out
</Route>
<Route 2>
    Path	Vpxd_In => Vpxd_Out
</Route>
```

If you don&#8217;t want to log EventLogs to the Syslog Server just remove route 1 from the file or place # before each line.

The Config Explained:

The below code will load the module for Gelf communications, if you didn&#8217;t want to use gelf this could be changed to syslog.

```sh
<Extension gelf>
    Module      xm_gelf
</Extension>
```

We then set our inputs, inputs provide information that we want to log to our syslog server, they are then translated by nxlog into a format that our syslog server will understand. As you can see from the code the EventLog is quite simple as there is a plugin specifically for this, but for vCenter Log Files we need to use the im\_file module that will allow us to parse a text log file, we can then specify custom parameters to meet our requirements, i have included hostname, message, filename and sourcename but you could also split the $raw\_event (your raw data) and log many more fields if required.

```sh
<Input EventLog_In>
    Module	im_msvistalog
# For windows 2003 and earlier use the following:
#   Module      im_mseventlog
</Input>
<Input Vpxd_In>
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
</Input>
```

We then set where each log should be sent, as you can see i have a different output for each log type, you don&#8217;t need to do this but it makes it easier to see what is logging where in GrayLog2. You should only need to change the host to your syslog server and the port to your port (default 514) I change mine as each type of log has its own port.

```sh
<Output EventLog_Out>
    Module      om_udp
    Host        192.168.88.30
    Port        60001
    OutputType	GELF
</Output>
<Output Vpxd_Out>
    Module      om_udp
    Host        192.168.88.30
    Port        60002
    OutputType	GELF
</Output>
```

The Route tells NxLog which output to send inputs to. In my example I have 2 routes the 1st one tells the eventlogs\_in to be sent to eventlogs\_out and the 2nd does the same but for the VPXD logs, you could use one route if you were only having one output by using a comma to seperate vpxd\_in and eventlog\_in (e.g. EventLog\_in,VPXD\_In => MyCustom_Out)

```sh
<Output EventLog_Out>
    Module      om_udp
    Host        10.255.0.38
    Port        60001
    OutputType	GELF
</Output>
<Output Vpxd_Out>
    Module      om_udp
    Host        10.255.0.38
    Port        60002
    OutputType	GELF
</Output>
```

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

Hope this helped you, any issues or questions please let me know over on my [Discord](https://discord.gg/6fmekudc8Q)

Steve
