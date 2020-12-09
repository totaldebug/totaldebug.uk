---
id: 1762
title: 'Install FreeRadius on CentOS 7 with DaloRadius for management &#8211; Updated'
date: 2017-02-01T13:53:32+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=1762
permalink: /install-freeradius-centos-7-with-daloradius-for-management/
post_views_count:
  - "741"
voted_IP:
  - 'a:2:{s:10:"92.97.30.5";i:1492521654;s:14:"202.182.59.196";i:1495606722;}'
votes_count:
  - "2"
slide_template:
  - default
audio_mp3:
  - ""
audio_ogg:
  - ""
audio_embed:
  - ""
video_mp4:
  - ""
video_ogv:
  - ""
video_webm:
  - ""
video_embed:
  - ""
video_poster:
  - ""
link_url:
  - ""
status_author:
  - ""
quote_author:
  - ""
featured_media:
  - 'true'
categories:
  - CentOS
tags:
  - centos
  - centos 7
  - centos7
  - daloradius
  - freeradius
  - radius
---
I have recently purchased a load of Ubiquiti UniFi equipment, as part of this i have the UniFi USG which in order to deploy a User VPN requires a RADUIS Server for user authentication. This article will run through how to install and set this up.

<!--more-->

I will be using FreeRADIUS as this is the most commonly used, it supports most common authentication protocols.

Disable SELinux:  
vi /etc/sysconfig/selinux

<pre class="lang:default decode:true ">SELINUX=disabled</pre>

### First we need to update our CentOS server and install the required applications:

<pre class="lang:default decode:true">yum install -y epel-release
yum install -y http://rpms.remirepo.net/enterprise/remi-release-7.rpm
yum-config-manager --enable remi-php72
yum update -y
yum install -y freeradius freeradius-utils freeradius-mysql nginx mariadb-server mariadb php-cli php-mysqlnd php-devel php-gd php-mcrypt php-mbstring php-xml php-pear php-fpm
pear channel-update pear.php.net
pear install DB
systemctl reboot</pre>

We must now enable the FreeRADIUS, MariaDB, PHP-FPM and Nginx services to run at boot:

<pre class="lang:default decode:true">systemctl enable radiusd
systemctl enable nginx
systemctl enable mariadb
systemctl enable php-fpm
systemctl start mariadb</pre>

We need to configure MariaDB:

<pre class="lang:default decode:true">mysql_secure_installation
----
Set the root password
Remove the Anonymous User
Disable root remote login
Remove Test DBs
Reloar Privileges
----</pre>

Allow local connections only:

<pre class="lang:default decode:true">vim /etc/my.cnf 
----
 [mysqld]
 bind-address=127.0.0.1
----</pre>

Configure the database to work with freeRADIUS:

<pre class="lang:default decode:true">mysql -u root -p 
----
CREATE DATABASE radius;
GRANT ALL ON radius.* TO radius@localhost IDENTIFIED BY "radiuspassword";
FLUSH PRIVILEGES;
quit
----</pre>

We need to add Radius and HTTP ports to the firewall:

<pre class="lang:default decode:true">systemctl start firewalld
firewall-cmd --zone=public --add-service=radius --add-service=http --permanent
firewall-cmd --reload</pre>

Now we will run Radius in debug mode to make sure it runs correctly:

<pre class="lang:default decode:true ">radiusd -X</pre>

Import the Radius database scheme:

<pre class="lang:default decode:true ">mysql -u root -p radius &lt; /etc/raddb/mods-config/sql/main/mysql/schema.sql</pre>

Create a soft line for SQL:

<pre class="lang:default decode:true ">ln -s /etc/raddb/mods-available/sql /etc/raddb/mods-enabled/</pre>

configure the SQL module and change the database connection, edit the existing file, find the text below and make sure it matches:

<pre class="lang:default decode:true ">vi /etc/raddb/mods-available/sql
----
sql {
  driver = "rlm_sql_mysql"
  dialect = "mysql"

  # Connection info:
  server = "localhost"
  port = 3306
  login = "radius"
  password = "radiuspassword"

  # Database table configuration for everything except Oracle
  radius_db = "radius"
}

# Set to ‘yes’ to read radius clients from the database (‘nas’ table)
# Clients will ONLY be read on server startup.
read_clients = yes

# Table to keep radius client info
client_table = “nas”
----</pre>

Change the group for the SQL folder to radiusd:

<pre class="lang:default decode:true ">chgrp -h radiusd /etc/raddb/mods-enabled/sql</pre>

Configure PHP (update the below lines in the file):

<pre class="lang:default decode:true ">vi /etc/php-fpm.d/www.conf
----------------
listen = /var/run/php-fpm/php-fpm.sock
listen.owner = nobody
listen.group = nobody
user = nginx
group = nginx</pre>

Configure Nginx (add the &#8220;location&#8221; :

<pre class="lang:default decode:true">vi /etc/nginx/conf.d/default.conf
-------------------
server {
    ##other data here

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}</pre>

Installing Daloradius:

<pre class="lang:default decode:true ">wget https://github.com/lirantal/daloradius/archive/master.zip
unzip master.zip
mv daloradius-master/ daloradius
cd daloradius</pre>

Import Daloradius MySQL:

<pre class="lang:default decode:true ">mysql -u root -p radius &lt; contrib/db/fr2-mysql-daloradius-and-freeradius.sql 
mysql -u root -p radius &lt; contrib/db/mysql-daloradius.sql</pre>

Move to the httpd directory:

<pre class="lang:default decode:true">cd ..
mv daloradius /usr/share/nginx/html</pre>

change permissions for httpd:

<pre class="lang:default decode:true">chown -R nginx:nginx /usr/share/nginx/html/daloradius/
chmod 664 /usr/share/nginx/html/daloradius/library/daloradius.conf.php</pre>

Modify configuration for MySQL:

<pre class="lang:default decode:true">vi /usr/share/nginx/html/daloradius/library/daloradius.conf.php
----
CONFIG_DB_USER
CONFIG_DB_PASS
CONFIG_DB_NAME
----</pre>

To make sure everything works restart all services:

<pre class="lang:default decode:true">systemctl restart radiusd
systemctl restart mariadb
systemctl restart php-fpm
systemctl restart nginx</pre>

Access the web interface:

<pre class="lang:default decode:true ">http://FQDN_IP_OF_SERVER/daloradius/login.php</pre>

Default Login:  
User: Administrator  
Pass: radius