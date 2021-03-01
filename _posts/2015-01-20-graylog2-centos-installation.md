---
title: Graylog2 CentOS Installation
date: 2015-01-20
layout: post
---
I recently required a syslog server that was easy to use with a web interface to monitor some customers firewalls. I had been looking at Splunk but due to the price of this product it was not a viable option for what I required.

After a little searching I came across [Graylog2](https://www.graylog2.org/) which is an open source alternative to Splunk and is totally free! You only need to pay if you would like support from them.
<!--more-->

So here is how I setup the server and got it working on my CentOS Server.

## Install & Configure Elastic Search

Download and install the Public Signing Key:

```sh
rpm --import https://packages.elasticsearch.org/GPG-KEY-elasticsearch
```

Create the following file `/etc/yum.repos.d/elasticsearch.repo`

```sh
[elasticsearch-1.4]
name=Elasticsearch repository for 1.4.x packages
baseurl=http://packages.elasticsearch.org/elasticsearch/1.4/centos
gpgcheck=1
gpgkey=http://packages.elasticsearch.org/GPG-KEY-elasticsearch
enabled=1
```

And your repository is ready for use. You can install it with :

```sh
yum install elasticsearch
```

Configure Elasticsearch to automatically start during boot:

```sh
chkconfig --add elasticsearch
```

To configure ElasticSearch for use with Graylog2 edit `/etc/elasticsearch/elasticsearch.yml`

```sh
cluster.name: graylog2
node.data: true
bootstrap.mlockall: true
ES_HEAP_SIZE: 2048
discovery.zen.ping.multicast.enabled: false
discovery.zen.ping.unicast.hosts: ["127.0.0.1", "IP_ADDR"]
```

Start the ElasticSearch service:

```sh
service elasticsearch start
```

## Install & Graylog2 Server and Web Client

Get the latest RPM for Graylog2 [here](https://www.graylog2.org/resources/documentation/general/packages) and run changing to the correct url:

```sh
sudo rpm -Uvh https://packages.graylog2.org/repo/packages/graylog2-x.xx-repository-el6_latest.rpm
```

Install Graylo2-Server and Graylog2-Web:

```sh
yum install graylog2-server graylog2-web
```

Edit the file `/etc/graylog2.conf` and change only the below:

```sh
password_secret =
root_password_sha2 =
elasticsearch_discovery_zen_ping_multicast_enabled = false
elasticsearch_discovery_zen_ping_unicast_hosts = IP_ADDR:9300
```

Edit the file /etc/graylog2/web/graylog2-web-interface.conf and change only the below:

```sh
graylog2-server.uris=""
application.secret=""
timezone="Europe/London"
```

Set Services to start at boot:

```sh
chkconfig --add graylog2-server
chkconfig --add graylog2-web
```

Start the services:

```sh
service graylog2-server start
service graylog2-web start
```

## Troubleshooting

Logs are stored in the following locations:
`/var/log/elasticsearch/*.log`
`/var/log/graylog2-server/*.log`
`/var/log/graylog2-web/*.log`

any errors in here should be quite easy to resolve. if you have any issues please let me know and I will assist where possible.
