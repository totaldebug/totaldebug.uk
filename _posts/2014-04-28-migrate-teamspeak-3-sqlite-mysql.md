---
title: Migrate TeamSpeak 3 from SQLite to MySQL
date: 2014-04-28
layout: post
---
One of the things I wanted to do was migrate my teamspeak server from SQLite to MySQL so I created the below which makes the migration easy.

<!--more-->

1. Stop the TeamSpeak Server

2.Run the following command to export configuration:

```sh
sqlite3 ts3server.sqlitedb .dump | grep -v "sqlite_sequence" |grep -v "COMMIT;" | grep -v "BEGIN TRANSACTION;" | grep -v "PRAGMA " | sed 's/autoincrement/auto_increment/Ig' | sed 's/"/`/Ig' &gt; ts3_export.sql
```

This will export the SQLite configuration in MySQL Format to a file called ts3_export.sql

3. Import the configuration to MySQL:

```sh
mysql -u username -p database_name &lt; ts3_export.sql
```

This will import the ts3_export.sql file into a database of your choosing.

4. edit ts3server.ini to the following:

```sh
machine_id=
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
logappend=0
```

5. Create a file called ts3db_mysql.ini which contains:

```sh
[config]
host=localhost
port=3306
username=ts3user
password=ts3password
database=ts3db
socket=
```

6. Start TeamSpeak and it should now be working on MySQL
