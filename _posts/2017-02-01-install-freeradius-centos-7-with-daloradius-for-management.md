---
title: 'Install FreeRadius on CentOS 7 with DaloRadius for management &#8211; Updated'
date: 2017-02-01
layout: post
---
I have recently purchased a load of Ubiquiti UniFi equipment, as part of this i have the UniFi USG which in order to deploy a User VPN requires a RADUIS Server for user authentication. This article will run through how to install and set this up.

<!--more-->

I will be using FreeRADIUS as this is the most commonly used, it supports most common authentication protocols.

Disable SELinux:
`vi /etc/sysconfig/selinux`

```sh
SELINUX=disabled
```

### First we need to update our CentOS server and install the required applications:

```sh
yum install -y epel-release
yum install -y http://rpms.remirepo.net/enterprise/remi-release-7.rpm
yum-config-manager --enable remi-php72
yum update -y
yum install -y freeradius freeradius-utils freeradius-mysql nginx mariadb-server mariadb php-cli php-mysqlnd php-devel php-gd php-mcrypt php-mbstring php-xml php-pear php-fpm
pear channel-update pear.php.net
pear install DB
systemctl reboot
```

We must now enable the FreeRADIUS, MariaDB, PHP-FPM and Nginx services to run at boot:

```sh
systemctl enable radiusd
systemctl enable nginx
systemctl enable mariadb
systemctl enable php-fpm
systemctl start mariadb
```

We need to configure MariaDB:
`mysql_secure_installation`

```sh
Set the root password
Remove the Anonymous User
Disable root remote login
Remove Test DBs
Reload Privileges
```

Allow local connections only: `vim /etc/my.cnf`

```sh
 [mysqld]
 bind-address=127.0.0.1
```

Configure the database to work with freeRADIUS:
`mysql -u root -p`

```mysql
CREATE DATABASE radius;
GRANT ALL ON radius.* TO radius@localhost IDENTIFIED BY "radiuspassword";
FLUSH PRIVILEGES;
quit
```

We need to add Radius and HTTP ports to the firewall:

```sh
systemctl start firewalld
firewall-cmd --zone=public --add-service=radius --add-service=http --permanent
firewall-cmd --reload
```

Now we will run Radius in debug mode to make sure it runs correctly:

```sh
radiusd -X
```

Import the Radius database scheme:

```sh
mysql -u root -p radius < /etc/raddb/mods-config/sql/main/mysql/schema.sql
```

Create a soft line for SQL:

```sh
ln -s /etc/raddb/mods-available/sql /etc/raddb/mods-enabled/
```

configure the SQL module and change the database connection, edit the existing file, find the text below and make sure it matches:
`vi /etc/raddb/mods-available/sql`
```sh
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
```

Change the group for the SQL folder to radiusd:

```sh
chgrp -h radiusd /etc/raddb/mods-enabled/sql
```

Configure PHP (update the below lines in the file):

`vi /etc/php-fpm.d/www.conf`

```sh
listen = /var/run/php-fpm/php-fpm.sock
listen.owner = nobody
listen.group = nobody
user = nginx
group = nginx
```

Configure Nginx (add the &#8220;location&#8221; :

`vi /etc/nginx/conf.d/default.conf`

```sh
server {
    ##other data here

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

Installing Daloradius:

```sh
wget https://github.com/lirantal/daloradius/archive/master.zip
unzip master.zip
mv daloradius-master/ daloradius
cd daloradius
```

Import Daloradius MySQL:

```sh
mysql -u root -p radius &lt; contrib/db/fr2-mysql-daloradius-and-freeradius.sql
mysql -u root -p radius &lt; contrib/db/mysql-daloradius.sql
```

Move to the httpd directory:

```sh
cd ..
mv daloradius /usr/share/nginx/html
```

change permissions for httpd:

```sh
chown -R nginx:nginx /usr/share/nginx/html/daloradius/
chmod 664 /usr/share/nginx/html/daloradius/library/daloradius.conf.php
```

Modify configuration for MySQL:

`vi /usr/share/nginx/html/daloradius/library/daloradius.conf.php`

```sh
CONFIG_DB_USER
CONFIG_DB_PASS
CONFIG_DB_NAME
```

To make sure everything works restart all services:

```sh
systemctl restart radiusd
systemctl restart mariadb
systemctl restart php-fpm
systemctl restart nginx
```

Access the web interface:

```sh
http://FQDN_IP_OF_SERVER/daloradius/login.php
```

Default Login:
User: Administrator
Pass: radius
