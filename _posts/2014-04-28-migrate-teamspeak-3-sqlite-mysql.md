---
id: 333
title: Migrate TeamSpeak 3 from SQLite to MySQL
date: 2014-04-28T14:59:17+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=333
permalink: /migrate-teamspeak-3-sqlite-mysql/
post_views_count:
  - "2956"
voted_IP:
  - 'a:11:{s:11:"86.48.80.68";i:1401692145;s:13:"78.43.220.169";i:1405851809;s:11:"83.8.162.93";i:1419231380;s:12:"134.3.57.220";i:1423562920;s:13:"89.227.101.45";i:1437682235;s:15:"186.105.254.182";i:1453226375;s:12:"88.65.164.23";i:1453640081;s:13:"89.70.158.187";i:1474763628;s:14:"89.102.224.123";i:1486559205;s:14:"212.158.129.93";i:1486860139;s:12:"176.56.237.6";i:1487014884;}'
votes_count:
  - "11"
categories:
  - TeamSpeak 3
tags:
  - Mysql
  - sqlite
  - teamspeak
  - ts3
---
One of the things I wanted to do was migrate my teamspeak server from SQLite to MySQL so I created the below which makes the migration easy.

<!--more-->

1. Stop the TeamSpeak Server

2.Run the following command to export configuration:

<pre class="lang:sh decode:true ">sqlite3 ts3server.sqlitedb .dump | grep -v "sqlite_sequence" |grep -v "COMMIT;" | grep -v "BEGIN TRANSACTION;" | grep -v "PRAGMA " | sed 's/autoincrement/auto_increment/Ig' | sed 's/"/`/Ig' &gt; ts3_export.sql</pre>

This will export the SQLite configuration in MySQL Format to a file called ts3_export.sql

3. Import the configuration to MySQL:

<pre class="lang:default decode:true ">mysql -u username -p database_name &lt; ts3_export.sql</pre>

This will import the ts3_export.sql file into a database of your choosing.

4. edit ts3server.ini to the following:

<pre class="lang:default decode:true ">machine_id=
default_voice_port=9987
voice_ip=0.0.0.0
licensepath=
filetransfer_port=30033
filetransfer_ip=0.0.0.0
query_port=10011
query_ip=0.0.0.0
query_ip_whitelist=query_ip_whitelist.txt
query_ip_blacklist=query_ip_blacklist.txt
dbplugin=ts3db_mysql
dbpluginparameter=ts3db_mysql.ini
dbsqlpath=sql/
dbsqlcreatepath=create_mysql/
dbconnections=10
logpath=logs
logquerycommands=0
dbclientkeepdays=30
logappend=0</pre>

5. Create a file called ts3db_mysql.ini which contains:

<pre class="lang:default decode:true ">[config]
host=localhost
port=3306
username=ts3user
password=ts3password
database=ts3db
socket=</pre>

6. Start TeamSpeak and it should now be working on MySQL