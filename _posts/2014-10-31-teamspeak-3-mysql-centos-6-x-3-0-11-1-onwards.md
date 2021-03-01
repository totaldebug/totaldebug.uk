---
title: Teamspeak 3 with MySQL on CentOS 6.x (3.0.11.1 Onwards)
date: 2014-10-31
layout: post
---
By default Teamspeak 3 uses a SQLite database, most people tend to use this however for those of us that prefer MySQL there is a way to change it.

Follow this small tutorial to create a Teamspeak 3 Server on CentOS 6.x using a MySQL Database!
<!--more-->

First we need to install or upgrade MySQL:
Install:

```sh
rpm -Uvh http://download.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-6.rpm
yum --enablerepo=remi,remi-test list mysql mysql-server
yum --enablerepo=remi,remi-test install mysql mysql-server
```

Upgrade:

```sh
rpm -Uvh http://download.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-6.rpm
yum --enablerepo=remi,remi-test list mysql mysql-server
yum --enablerepo=remi,remi-test update mysql mysql-server
mysql_upgrade -u root -p
```

Now we need to create a new user on our server, this user will be used for the installation and running of teamspeak. For security reasons this user will not have sudo etc.

```sh
useradd ts3user
passwd ts3user
```

We are now in a position where we can configure MySQL with a Database and User for Teamspeak

```sh
service mysqld start
chkconfig mysqld on
mysql_secure_installation

mysql -uroot -p
```
```mysql
create database ts3db;
grant all on ts3db.* to 'ts3user'@'127.0.0.1' identified by 'ts3password';
flush privileges;
```

Once the MySQL Database is set-up along with a user we will create an init script for Teamspeak so that we can start the server as a service, create the script: vi /etc/init.d/teamspeak

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

Now we will login with our new ts3user created at the beginning of this tutorial, download Teamspeak Server 3 64-bit for Linux and extract in your home directory, get the latest version here: <http://www.teamspeak.com/?page=downloads>
As TS3User:

```sh
cd /home/ts3user/
wget http://dl.4players.de/ts/releases/3.0.11.1/teamspeak3-server_linux-amd64-3.0.11.1.tar.gz
tar -xvf teamspeak3-server_linux-amd64-3.0.11.1.tar.gz
mv teamspeak3-server_linux-amd64 teamspeak3-server
cd teamspeak3-server
```

As Root:

```sh
cp redist/libmariadb.so.2 /lib64/libmariadb.so.2
ldd libts3db_mariadb.so
```

As Ts3user:
ts3server.ini stores the configuration for the teamspeak server, we need to edit this to work with MySQL instead of SQLite: vi ts3server.ini

```sh
machine_id=1
default_voice_port=9987
voice_ip=0.0.0.0
licensepath=
filetransfer_port=30033
filetransfer_ip=0.0.0.0
query_port=10011
query_ip=0.0.0.0
dbplugin=ts3db_mariadb
dbpluginparameter=ts3db_mariadb.ini
dbsqlpath=sql/
dbsqlcreatepath=create_mariadb/
logpath=logs
logquerycommands=0
dbclientkeepdays=30
logappend=0
query_skipbruteforcecheck=0
```

We must now create a file called ts3db_mariadb.ini, this will hold your database login details:

```sh
[config]
host=127.0.0.1
port=3306
username=ts3user
password=ts3password
database=ts3db
socket=
```

Start Teamspeak:

```sh
./ts3server_startscript.sh start
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
