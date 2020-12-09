---
id: 782
title: 'Teamspeak 3 &#8211; Recovering privilege key after first startup (MySQL/MariaDB Only)'
date: 2016-05-05T14:38:37+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=782
permalink: /teamspeak-3-recovering-privilege-key-first-startup-mysqlmariadb/
post_views_count:
  - "500"
  - "500"
categories:
  - TeamSpeak 3
tags:
  - linux
  - mariadb
  - Mysql
  - privilege
  - teamspeak
  - teamspeak 3
  - token
---
When deploying a Teamspeak3 server one thing that is vital for the first time startup is to make a note of the privilege key, but what do you do if for some reason you didn&#8217;t write it down?

In this article I will show you how to retrieve it!  
<!--more-->

  1. Login to your Teamspeak3 server
  2. Connect to SQL: <pre class="lang:default decode:true">mysql -uyouruser -p</pre>

  3. Select your TS3 Database: <pre class="lang:default decode:true " >USE &lt;DatabaseName&gt;;</pre>

  4. Sleect the Tokens Table: <pre class="lang:default decode:true " >SELECT * FROM tokens;</pre>

  5. You should see a privilege key copy this (token_key) column

Its as simple as that! the privilege key can only be used once, when it has been used it will be removed from the tokens table.