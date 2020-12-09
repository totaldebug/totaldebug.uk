---
id: 508
title: Graylog2 CentOS Installation
date: 2015-01-20T11:48:02+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=508
permalink: /graylog2-centos-installation/
post_views_count:
  - "1738"
xyz_fbap:
  - "1"
categories:
  - CentOS
  - Graylog2
tags:
  - alternative
  - centos
  - Free
  - graylog2
  - splunk
  - support
  - syslog
---
I recently required a syslog server that was easy to use with a web interface to monitor some customers firewalls. I had been looking at Splunk but due to the price of this product it was not a viable option for what I required.

After a little searching I came across [Graylog2](https://www.graylog2.org/) which is an open source alternative to Splunk and is totally free! You only need to pay if you would like support from them.  
<!--more-->

So here is how I setup the server and got it working on my CentOS Server.

## Install & Configure Elastic Search

Download and install the Public Signing Key:

<pre class="lang:default decode:true ">rpm --import https://packages.elasticsearch.org/GPG-KEY-elasticsearch</pre>

Create the following file /etc/yum.repos.d/elasticsearch.repo

<pre class="lang:default decode:true ">[elasticsearch-1.4]
name=Elasticsearch repository for 1.4.x packages
baseurl=http://packages.elasticsearch.org/elasticsearch/1.4/centos
gpgcheck=1
gpgkey=http://packages.elasticsearch.org/GPG-KEY-elasticsearch
enabled=1</pre>

And your repository is ready for use. You can install it with :

<pre class="lang:default decode:true ">yum install elasticsearch</pre>

Configure Elasticsearch to automatically start during boot:

<pre class="lang:default decode:true ">chkconfig --add elasticsearch</pre>

To configure ElasticSearch for use with Graylog2 edit /etc/elasticsearch/elasticsearch.yml

<pre class="lang:default decode:true ">cluster.name: graylog2
node.data: true
bootstrap.mlockall: true
ES_HEAP_SIZE: 2048
discovery.zen.ping.multicast.enabled: false
discovery.zen.ping.unicast.hosts: ["127.0.0.1", "IP_ADDR"]
</pre>

Start the ElasticSearch service: 

<pre class="lang:default decode:true " >service elasticsearch start</pre>

## Install & Graylog2 Server and Web Client

Get the latest RPM for Graylog2 [here](https://www.graylog2.org/resources/documentation/general/packages) and run changing to the correct url:

<pre class="lang:default decode:true ">sudo rpm -Uvh https://packages.graylog2.org/repo/packages/graylog2-x.xx-repository-el6_latest.rpm</pre>

Install Graylo2-Server and Graylog2-Web:

<pre class="lang:default decode:true " >yum install graylog2-server graylog2-web</pre>

Edit the file /etc/graylog2.conf and change only the below:

<pre class="lang:default decode:true " >password_secret = 
root_password_sha2 = 
elasticsearch_discovery_zen_ping_multicast_enabled = false
elasticsearch_discovery_zen_ping_unicast_hosts = IP_ADDR:9300</pre>

Edit the file /etc/graylog2/web/graylog2-web-interface.conf and change only the below:

<pre class="lang:default decode:true " >graylog2-server.uris=""
application.secret=""
timezone="Europe/London"</pre>

Set Services to start at boot:

<pre class="lang:default decode:true ">chkconfig --add graylog2-server
chkconfig --add graylog2-web</pre>

Start the services: 

<pre class="lang:default decode:true ">service graylog2-server start
service graylog2-web start</pre>

## Troubleshooting

Logs are stored in the following locations:  
/var/log/elasticsearch/*.log  
/var/log/graylog2-server/*.log  
/var/log/graylog2-web/*.log

any errors in here should be quite easy to resolve. if you have any issues please let me know and I will assist where possible.