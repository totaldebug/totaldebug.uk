---
id: 1752
title: Install UniFi Controller on CentOS 7
date: 2017-02-01T09:50:25+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=1752
permalink: /install-unifi-controller-centos-7/
post_views_count:
  - "381"
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
image: https://spottedhyena.co.uk/wp-content/uploads/2017/02/unifi.png
categories:
  - CentOS
  - Ubiquiti
tags:
  - centos
  - centos 7
  - centos7
  - controller
  - ubiquiti
  - unifi
---
This is a short simple guide to assist users with installing the Ubiquiti UniFi Controller required for all UniFi devices on a CentOS 7 Server. 

<!--more-->

### First we need to update our CentOS server and disable SELinux:

<pre class="lang:default decode:true " >yum -y update
sed -i /etc/selinux/config -r -e 's/^SELINUX=.*/SELINUX=disabled/g'
systemctl reboot</pre>

NOTE: you dont need to disable SELinux however may experience issues if it isn&#8217;t setup correctly. 

### Now we need to make sure we have EPEL Repo: 

<pre class="lang:default decode:true " >yum -y install epel-release</pre>

### Install services required by the Controller:

<pre class="lang:default decode:true " >yum -y install mongodb-server java-1.8.0-openjdk unzip wget</pre>

### Create our service user account:

<pre class="lang:default decode:true " >useradd -r ubnt -s /sbin/nologin</pre>

We put the -s /sbin/nologin so that this user cannot be logged in as a user, only the service will be able to use this account. 

### Download and extract the UniFi Controller software:

<pre class="lang:default decode:true " >cd ~ && wget http://dl.ubnt.com/unifi/5.3.11/UniFi.unix.zip
unzip -q UniFi.unix.zip -d /opt
chown -R ubnt:ubnt /opt/UniFi</pre>

At the time of writing the latest version was v5.3.11, change the version number in the download link to the latest version. 

### Create a startup script for use with Systemd:

<pre class="lang:default decode:true " >vi /etc/systemd/system/unifi.service
---
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
---</pre>

### Configure Firewalld:

<pre class="lang:default decode:true " >systemctl stop firewalld.service
vi /etc/firewalld/services/unifi.xml
---
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;service version="1.0"&gt;
    &lt;short&gt;unifi&lt;/short&gt;
    &lt;description&gt;UniFi Controller&lt;/description&gt;
    &lt;port port="8081" protocol="tcp"/&gt;
    &lt;port port="8080" protocol="tcp"/&gt;
    &lt;port port="8443" protocol="tcp"/&gt;
    &lt;port port="8880" protocol="tcp"/&gt;
    &lt;port port="8843" protocol="tcp"/&gt;
    &lt;port port="10001" protocol="udp"/&gt;
    &lt;port port="3478" protocol="udp"/&gt;
&lt;/service&gt;
---</pre>

Once the firewall rules xml file is created we need to add this to our firewall zones, the default zone will be public but you should know for your firewall. 

<pre class="lang:default decode:true " >systemctl start firewalld.service
firewall-cmd --permanent --zone=public --add-service=unifi</pre>

### Enable the service to run when the server boots: 

<pre class="lang:default decode:true " >systemctl enable unifi.service</pre>

### Remove the zip and reboot the server:

<pre class="lang:default decode:true " >rm -rf ~/UniFi.unix.zip
systemctl reboot</pre>

Once the server is back online you should be able to access the controller via the URL: https://FQDN\_or\_IP:8443 Follow the simple wizard to complete the setup of your controler, I would also recommend you register with Ubiquiti when you setup the controller, this will allow you to manage it remotely on a mobile device. 

Credit to: <https://deviantengineer.com>