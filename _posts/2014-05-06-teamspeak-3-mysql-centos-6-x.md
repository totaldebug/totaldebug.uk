---
id: 337
title: Teamspeak 3 with MySQL on CentOS 6.x (before 3.0.11.1)
date: 2014-05-06T09:41:11+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=337
permalink: /teamspeak-3-mysql-centos-6-x/
post_views_count:
  - "5229"
voted_IP:
  - 'a:2:{s:11:"86.48.80.68";i:1401692152;s:12:"41.34.235.70";i:1414385126;}'
votes_count:
  - "2"
categories:
  - CentOS
  - TeamSpeak 3
tags:
  - centos
  - Mysql
  - sqlite
  - teamspeak
  - ts
  - ts3
---
NOTE: As of Version 3.0.11.1 this tutorial is no longer applicable. I will soon re-write this to accommodate the latest version.

By default Teamspeak 3 uses a SQLite database, most people tend to use this however for those of us that prefer MySQL there is a way to change it.

Follow this small tutorial to create a Teamspeak 3 Server on CentOS 6.x using a MySQL Database!  
<!--more-->V

[IDEO AVAILABLE HERE ](http://youtu.be/rxxeC5c-6Yw)  
First we need to have mysql installed:

<pre class="lang:sh decode:true">install  mysql-server mysql-common</pre>

To use a MySQL database, you need to install additional libraries not available from the default repositories. Download [MySQL-shared-compat-6.0.11-0.rhel5.x86_64.rpm](http://blog.dastrup.com/wp-content/uploads/2012/05/MySQL-shared-compat-6.0.11-0.rhel5.x86_64.rpm) (This is 64 bit version. If you are on a 32 bit system, you’ll need to find it somewhere) and install

<pre class="lang:default decode:true">yum localinstall MySQL-shared-compat-6.0.11-0.rhel5.x86_64.rpm</pre>

Now we need to create a new user on our server, this will be used for the installation and running of teamspeak. For security reasons this user will not have sudo etc.

<pre class="lang:default decode:true">useradd ts3user
passwd ts3user</pre>

We are now in a position where we can configure MySQL with a Database and User for Teamspeak

<pre class="lang:default decode:true">service mysqld start
chkconfig mysqld on
mysql -uroot -p

UPDATE mysql.user SET Password = PASSWORD('password') WHERE User = 'root';
create database ts3db;
grant all on ts3db.* to 'ts3user'@'localhost' identified by 'ts3password';
flush privileges;</pre>

Once the MySQL Database is setup along with a user we will create an init script for Teamspeak so that we can start the server as a service, create the script: vi /etc/init.d/teamspeak

<pre class="lang:sh decode:true">#!/bin/bash
# /etc/init.d/teamspeak

### BEGIN INIT INFO
# Provides: teamspeak
# Required-Start: $local_fs $remote_fs
# Required-Stop: $local_fs $remote_fs
# Should-Start: $network
# Should-Stop: $network
# Default-Start: 2 3 4 5
# Default-Stop: 0 1 6
# Short-Description: Teamspeak 3 Server
# chkconfig: 2345 94 05
# Description: Starts the Teamspeak 3 server
### END INIT INFO

# Source function library.
. /etc/rc.d/init.d/functions

# Settings
SERVICENAME='Teamspeak 3 Servers'
SPATH='/home/ts3user/teamspeak3-server/'
SERVICE='/home/ts3user/teamspeak3-server/ts3server_startscript.sh'
OPTIONS='inifile=ts3server.ini'
USERNAME='ts3user'

ME=`whoami`
as_user() {
if [ $ME == $USERNAME ] ; then
bash -c "$1"
else
su - $USERNAME -c "$1"
fi
}

mc_start() {
echo "Starting $SERVICENAME..."
cd $SPATH
as_user "cd $SPATH && $SERVICE start ${OPTIONS}"
}

mc_stop() {
echo "Stopping $SERVICENAME"
as_user "$SERVICE stop"
}

mc_status(){
    # run checks to determine if the service is running or use generic status
    status -p /home/ts3user/teamspeak3-server/ts3server.pid $SERVICENAME
}
mc_status_q(){
    rh_status &gt;/dev/null 2&gt;&1
}

# Start and stop the service here
case "$1" in
start)
mc_start
;;
stop)
mc_stop
;;
restart)
mc_stop
mc_start
;;
status)
mc_status
;;
*)
echo "Usage: /etc/init.d/teamspeak {start|stop|restart|status}"
exit 1
;;
esac

exit 0</pre>

Now we will login with our new ts3user created at the beginning of this tutorial, download Teamspeak Server 3 64-bit for Linux and extract in your home directory, get the latest version here: <http://www.teamspeak.com/?page=downloads>

<pre class="lang:sh decode:true">wget http://dl.4players.de/ts/releases/3.0.10.3/teamspeak3-server_linux-amd64-3.0.10.3.tar.gz
tar -xf teamspeak3-server_linux-amd64-3.0.10.3.tar.gz
mv teamspeak3-server_linux-amd64-3.0.10.3 teamspeak3-server
cd teamspeak3-server
ldd libts3db_mysql.so</pre>

ts3server.ini stores the configuration for the teamspeak server, we need to edit this to work with MySQL instead of SQLite: vi ts3server.ini

<pre class="lang:default decode:true">machine_id=
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

We must now create a file called ts3db_mysql.ini, this will hold your database login details:

<pre class="lang:default decode:true">[config]
host=localhost
port=3306
username=ts3user
password=ts3password
database=ts3db
socket=
</pre>

Start Teamspeak with a few additional paramaters, one tells it where the configuration file is and the other tells it to change the serveradmin password:

<pre class="lang:default decode:true">./ts3server_startscript.sh start inifile=ts3server.ini serveradmin_password=passwordhere</pre>

You should now see that teamspeak 3 is installed and you will see a message on screen with a privelage token and your server query admin account details, it is important to copy these as you will need them to administer your server.

Stop the server:

<pre class="lang:default decode:true">./ts3server_startscript.sh stop</pre>

Check the logs in the log directory. if everything is OK, log back in as root, enable the service and start it:

<pre class="lang:default decode:true">chmod =x /etc/init.d/teamspeak
chkconfig --add teamspeak
chkconfig teamspeak on
service teamspeak start</pre>

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;