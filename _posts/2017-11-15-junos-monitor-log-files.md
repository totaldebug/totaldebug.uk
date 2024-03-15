---
title: 'JUNOS: Monitor Log Files'
date: 2017-11-15T16:58:29+00:00
author: marksie1988
layout: post
categories: [Networking]
tags: [juniper, junos, logs, match, monitor]
---
When working with JUNOS Switches etc. you may want to monitor the logs over a period of time without loading them every few minutes and scrolling to the bottom?

Well these few commands show you how to do this.

<!--more-->

In order to start the monitoring run the following command:

<pre class="lang:default decode:true ">monitor start &lt;log-file-name&gt;</pre>

Here is an example command:

<pre class="lang:default decode:true ">monitor start messages</pre>

Any changes to the log file will automatically be posted to your screen.

If you want to filter the logs to only show records with certain words then use the following command:

<pre class="lang:default decode:true ">monitor start messages | match error</pre>

In order to stop the logs:

<pre class="lang:default decode:true ">monitor stop</pre>

Hopefully this article will assist you in viewing your logs with more ease.
