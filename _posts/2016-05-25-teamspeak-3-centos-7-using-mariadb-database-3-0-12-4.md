---
title: Teamspeak 3 on CentOS 7 using MariaDB Database (3.0.12.4)
date: 2016-05-25
layout: post
---
This tutorial takes you through setting up Teamspeak 3 on CentOS 7, I will also be going through using a MariaDB database for the backend and a custom system services script.

We are using MariaDB as MySQL no longer ships with CentOS and MariaDB is a fork of MySQL

<!--more-->


Checkout the video at YouTube:


A few prerequisites that will be required before proceeding with this tutorial:

```sh
yum update -y
yum install wget perl net-tools mariadb mariadb-server -y
```

Now we need to create a new user on our server, this user will be used for the installation and running of TeamSpeak. For security reasons this user will not have sudo.

```sh
useradd ts3user
passwd ts3user
```

Our installation is complete so we can configure MySQL with a Database and User for Teamspeak to utilise:

```sh
systemctl start mariadb
systemctl enable mariadb
```

Secure MySQL follow the wizard:

```sh
mysql_secure_installation
```

Login to MySQL:

```sh
mysql -uroot -p
```

Run These queries:

```sh
create database ts3db;
grant all on ts3db.* to 'ts3user'@'127.0.0.1' identified by 'ts3password';
flush privileges;
```

Once the MySQL Database is set-up along with a user we will create a system service script for Teamspeak so that we can start the server as a service, create the script: `vi /usr/lib/systemd/system/ts3server.service`

```sh
[Unit]
Description=TeamSpeak 3 Server
After=network.target

[Service]
WorkingDirectory=/home/ts3user/bin/teamspeak3/
User=ts3user
Group=ts3user
Type=simple
ExecStart=/home/ts3user/bin/teamspeak3/ts3server_startscript.sh start inifile=ts3server.ini
ExecStop=/home/ts3user/bin/teamspeak3/ts3server_startscript.sh stop
PIDFile=/home/ts3user/bin/teamspeak3/ts3server.pid
RestartSec=15
Restart=always

[Install]
WantedBy=multi-user.target
```

sudo to our TS3 user created at the beginning of this tutorial, download Teamspeak Server 3 64-bit for Linux and extract in your home directory (get the latest version here: <http://www.teamspeak.com/?page=downloads>)
su as TS3User:

```sh
su ts3user
```

Download TS3, extract:

```sh
cd
mkdir bin
cd bin
wget http://dl.4players.de/ts/releases/3.0.12.4/teamspeak3-server_linux_amd64-3.0.12.4.tar.bz2
tar -xvf teamspeak3-server_linux_amd64-3.0.12.4.tar.bz2
mv teamspeak3-server_linux_amd64 teamspeak3
cd teamspeak3
```

We must edit ts3server.ini which stores the configuration for the teamspeak server, we will be changing the config to work with MySQL instead of SQLite: `vi ts3server.ini`

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

We must also create a file called ts3db_mariadb.ini, this will hold your database login details:

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

You should now see that Teamspeak 3 is installed and you will see a message on screen with a privilege token and your server query admin account details, it is important to copy these as you will need them to administer your server.

Stop the server:

```sh
./ts3server_startscript.sh stop
```

Check the logs in the log directory. if everything is OK, su back in as root:

```sh
su root
```

Enable the plugin library, service and start it:

```sh
cp redist/libmariadb.so.2 /lib64/libmariadb.so.2
ldd /home/ts3user/bin/teamspeak3/libts3db_mariadb.so
chmod +x /usr/lib/systemd/system/ts3server.service
systemctl enable ts3server
systemctl start ts3server
```

Now our server installation is completed we can open the ports on our firewall:
Voice:

```sh
firewall-cmd --zone=public --add-port=9987/udp --permanent
```

Server Query (good idea to restrict IP):

```sh
firewall-cmd --zone=public --add-port=10011/tcp --permanent
```

File Transfer:

```sh
firewall-cmd --zone=public --add-port=30033/tcp --permanent
```

Reload the firewall:

```sh
firewall-cmd --reload
```

and connect with our TS3 Client. The first person to logon will be asked to provide a privilege key, enter the one retrieved during the installation.
