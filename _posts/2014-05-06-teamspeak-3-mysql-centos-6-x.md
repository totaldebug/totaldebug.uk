---
title: Teamspeak 3 with MySQL on CentOS 6.x (before 3.0.11.1)
date: 2014-05-06
categories: [Linux, Teamspeak]
tags: [teamspeak, server, mysql]
---

> As of Version 3.0.11.1 this tutorial is no longer applicable. I will soon re-write this to accommodate the latest version.
{: .prompt-info }

By default Teamspeak 3 uses a SQLite database, most people tend to use this however for those of us that prefer MySQL there is a way to change it.

Follow this small tutorial to create a Teamspeak 3 Server on CentOS 6.x using a MySQL Database!
<!--more-->V

[VIDEO AVAILABLE HERE ](http://youtu.be/rxxeC5c-6Yw)
First we need to have mysql installed:

```sh
yum install mysql-server mysql-common
```

To use a MySQL database, you need to install additional libraries not available from the default repositories. Download [MySQL-shared-compat-6.0.11-0.rhel5.x86_64.rpm](http://blog.dastrup.com/wp-content/uploads/2012/05/MySQL-shared-compat-6.0.11-0.rhel5.x86_64.rpm) (This is 64 bit version. If you are on a 32 bit system, you’ll need to find it somewhere) and install

```sh
yum localinstall MySQL-shared-compat-6.0.11-0.rhel5.x86_64.rpm
```

Now we need to create a new user on our server, this will be used for the installation and running of teamspeak. For security reasons this user will not have sudo etc.

```sh
useradd ts3user
passwd ts3user
```

We are now in a position where we can configure MySQL with a Database and User for Teamspeak

```sh
service mysqld start
chkconfig mysqld on
mysql -uroot -p
```

```mysql
UPDATE mysql.user SET Password = PASSWORD('password') WHERE User = 'root';
create database ts3db;
grant all on ts3db.* to 'ts3user'@'localhost' identified by 'ts3password';
flush privileges;
```
Once the MySQL Database is setup along with a user we will create an init script for Teamspeak so that we can start the server as a service, create the script: `vi /etc/init.d/teamspeak`

```sh
#!/bin/bash
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

exit 0
```

Now we will login with our new ts3user created at the beginning of this tutorial, download Teamspeak Server 3 64-bit for Linux and extract in your home directory, get the latest version [here](http://www.teamspeak.com/?page=downloads)

```sh
wget http://dl.4players.de/ts/releases/3.0.10.3/teamspeak3-server_linux-amd64-3.0.10.3.tar.gz
tar -xf teamspeak3-server_linux-amd64-3.0.10.3.tar.gz
mv teamspeak3-server_linux-amd64-3.0.10.3 teamspeak3-server
cd teamspeak3-server
ldd libts3db_mysql.so
```

ts3server.ini stores the configuration for the teamspeak server, we need to edit this to work with MySQL instead of SQLite: `vi ts3server.ini`

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

We must now create a file called `ts3db_mysql.ini`, this will hold your database login details:

```sh
[config]
host=localhost
port=3306
username=ts3user
password=ts3password
database=ts3db
socket=
```

Start Teamspeak with a few additional parameters, one tells it where the configuration file is and the other tells it to change the serveradmin password:

```sh
./ts3server_startscript.sh start inifile=ts3server.ini serveradmin_password=passwordhere
```

You should now see that teamspeak 3 is installed and you will see a message on screen with a privilege token and your server query admin account details, it is important to copy these as you will need them to administer your server.

Stop the server:

```sh
./ts3server_startscript.sh stop
```

Check the logs in the log directory. if everything is OK, log back in as root, enable the service and start it:

```sh
chmod =x /etc/init.d/teamspeak
chkconfig --add teamspeak
chkconfig teamspeak on
service teamspeak start
```
