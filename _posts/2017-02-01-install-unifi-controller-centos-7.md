---
title: Install UniFi Controller on CentOS 7
date: 2017-02-01 09:50:25 +00:00
image:
  path: assets/img/posts/install-unifi-controller-centos-7/unifi.png
categories: [Linux, Unifi]
tags: [centos, centos7, controller, ubuquiti, unifi]
---
This is a short simple guide to assist users with installing the Ubiquiti UniFi Controller required for all UniFi devices on a CentOS 7 Server.

<!--more-->

### First we need to update our CentOS server and disable SELinux:

```shell
yum -y update
sed -i /etc/selinux/config -r -e 's/^SELINUX=.*/SELINUX=disabled/g'
systemctl reboot
```

> You don't need to disable SELinux however may experience issues if it isn't setup correctly.
{: .prompt-info }

### Now we need to make sure we have EPEL Repo:

```shell
yum -y install epel-release
```

### Install services required by the Controller:

```shell
yum -y install mongodb-server java-1.8.0-openjdk unzip wget
```

### Create our service user account:

```shell
useradd -r ubnt -s /sbin/nologin
```

We put the -s /sbin/nologin so that this user cannot be logged in as a user, only the service will be able to use this account.

### Download and extract the UniFi Controller software:

```shell
cd ~ && wget http://dl.ubnt.com/unifi/5.3.11/UniFi.unix.zip
unzip -q UniFi.unix.zip -d /opt
chown -R ubnt:ubnt /opt/UniFi
```

At the time of writing the latest version was v5.3.11, change the version number in the download link to the latest version.

### Create a startup script for use with Systemd:



```shell
#
# Systemd unit file for UniFi Controller
#

[Unit]
Description=UniFi Controller
After=syslog.target network.target

[Service]
Type=simple
User=ubnt
WorkingDirectory=/opt/UniFi
ExecStart=/usr/bin/java -Xmx1024M -jar /opt/UniFi/lib/ace.jar start
ExecStop=/usr/bin/java -jar /opt/UniFi/lib/ace.jar stop
SuccessExitStatus=143


[Install]
WantedBy=multi-user.target
```
{: file="/etc/systemd/system/unifi.service"}

### Configure Firewalld:

```shell
systemctl stop firewalld.service
```

```shell
<?xml version="1.0" encoding="utf-8"?>
<service version="1.0">
    <short>unifi</short>
    <description>UniFi Controller</description>
    <port port="8081" protocol="tcp"/>
    <port port="8080" protocol="tcp"/>
    <port port="8443" protocol="tcp"/>
    <port port="8880" protocol="tcp"/>
    <port port="8843" protocol="tcp"/>
    <port port="10001" protocol="udp"/>
    <port port="3478" protocol="udp"/>
</service>
```
{: file="/etc/firewalld/services/unifi.xml"}
Once the firewall rules xml file is created we need to add this to our firewall zones, the default zone will be public but you should know for your firewall.

```shell
systemctl start firewalld.service
firewall-cmd --permanent --zone=public --add-service=unifi
```

### Enable the service to run when the server boots:

```shell
systemctl enable unifi.service
```

### Remove the zip and reboot the server:

```shell
rm -rf ~/UniFi.unix.zip
systemctl reboot
```

Once the server is back online you should be able to access the controller via the URL: `https://FQDN\_or\_IP:8443` Follow the simple wizard to complete the setup of your controller, I would also recommend you register with Ubiquiti when you setup the controller, this will allow you to manage it remotely on a mobile device.

Credit to: [https://deviantengineer.com](https://deviantengineer.com)
