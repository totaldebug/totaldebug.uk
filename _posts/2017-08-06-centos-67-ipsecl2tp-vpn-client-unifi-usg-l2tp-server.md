---
id: 6171
title: CentOS 6/7 IPSec/L2TP VPN client to UniFi USG L2TP Server
date: 2017-08-06T20:30:46+00:00
categories: [Linux, Unifi]
tags: [centos, ipsec, vpn, l2tp, openswan, unifi, usg, xl2tpd]
---
Working with CentOS quite a lot I have spent time looking for configurations that work for various issues, one I have seen recently that took me a long time to resolve and had very poor documentation around the net was setting up an L2TP VPN.

In Windows or iOS its a nice simple setup where you enter all the required details and it sorts out the IPsec and L2TP VPN for you, In CentOS this is much different.

<!--more-->

First we need to add the EPEL Repository:
Now we need to install the software:

```shell
yum -y install epel-release
```

Now we need to install the software:

```shell
sudo yum -y install xl2tpd openswan
```

Make sure to start the openswan service:

```shell
systemctl start ipsec.service
```
{: title="CentOS 7"}

```shell
service ipsec start
```
{: title="CentOS 6"}

> If you don't start this service first you will receive the error `connect(pluto_ctl) failed: No such file or directory`
{: .prompt-warning }

## OpenSwan (IPSec)

> Where you see `%local` change this to your Client local IP Address, where you see `%server` change this to the FQDN / IP of the VPN Server public IP
{: .prompt-info }

Configure IPSec VPN:

```shell
config setup
     virtual_private=%v4:10.0.0.0/8,%v4:192.168.0.0/16,%v4:172.16.0.0/12
     nat_traversal=yes
     protostack=netkey
conn L2TP-PSK
     authby=secret
     pfs=no
     auto=add
     keyingtries=3
     dpddelay=30
     dpdtimeout=120
     dpdaction=clear
     rekey=yes
     ikelifetime=8h
     keylife=1h
     type=transport
# Replace %local below with your local IP address (private, behind NAT IP is okay as well)
     left=%local
     leftprotoport=17/1701
# Replace IP address with your VPN server's IP
     right=%server
     rightprotoport=17/1701
```
{: file="/etc/ipsec.conf"}

This file contains the basic information to establish a secure IPsec tunnel to the VPN server. It enables NAT Traversal for if your machine is behind a NATing router (most people are), and other options that are required to connect correctly to the remote IPsec server.

Create a file to contain the Pre-Shared Key for the VPN:

```shell
%local %server : PSK "your_pre_shared_key"
```
{: file="/etc/ipsec.secrets"}

Remember to replace the local (%local) and server (%server) IP addresses with the correct numbers for your location. The pre-shared key will be supplied by the VPN provider and will need to be placed in this file in cleartext form.

Add the connection so that we can use it:

```shell
ipsec auto --add L2TP-PSK
```

## xl2tpd (L2TP)

First we need to edit the configuration of xl2tpd with our new VPN:

```shell
[lac vpn-connection]
lns = %server
ppp debug = yes
pppoptfile = /etc/ppp/options.l2tpd.client
length bit = yes
```
{: file="/etc/xl2tpd/xl2tpd.conf"}

Now we need to create our options file:

```shell
ipcp-accept-local
ipcp-accept-remote
refuse-eap
require-mschap-v2
noccp
noauth
idle 1800
mtu 1410
mru 1410
defaultroute
usepeerdns
debug
logfile /var/log/xl2tpd.log
connect-delay 5000
proxyarp
name your_vpn_username
password your_password
```
{: file="/etc/ppp/options.l2tpd.client"}

Place your assigned username and password for the VPN server in this file.

Create the control file for xl2tpd:

```shell
mkdir -p /var/run/xl2tpd
touch /var/run/xl2tpd/l2tp-control
```

This completes the configuration of the applicable software suites to connect to a L2TP/IPsec server. To start the connection do the following:

```shell
systemctl start ipsec
systemctl start xl2tpd
systemctl enable ipsec.service
systemctl enable xl2tpd.service
```
{: title="CentOS 7"}

```shell
service openswan start
service xl2tpd start
chkconfig openswan on
chkconfig xl2tpd on
```
{: title="CentOS 6"}

```shell
ipsec auto --up L2TP-PSK
echo "c vpn-connection" > /var/run/xl2tpd/l2tp-control
```

At this point the tunnel is up and you should be able to see the interface for it if you type:

```shell
ifconfig ppp0
```

## Routing

Now that our tunnel is up and running we need to be able to route to our respective networks, this can be done two ways:

Add the route manually each time the VPN restarts:

```shell
route add -net xxx.xxx.xxx.xxx/xx dev ppp0
```

> Replace the **x** with the server local network and subnet mask e.g. 192.168.10.0/24
{: .prompt-info }

Add the route automatically:

> Edit the if-up file and add this before exit 0:
{: .prompt-info }

```shell
case  in
        192.168.10.1)
        # VPN - IP ROUTE BEING ADDED AT RECONNECTION
                route add -net xxx.xxx.xxx.xxx/xxx dev ppp0;
        ;;
esac
```
{: file="/etc/ppp/if-up"}

>Here we need to change **192.168.10.1** to the ppp0 gateway, also change the **x** with the server local network and subnet mask e.g. 192.168.10.0/24
{: .prompt-info }

To check the route is added simply type:

```shell
route
```

This will display a list of routes and your new route should be listed

## Troubleshooting

The main logs to check are:

```
/var/log/xl2tpd.log
/var/log/messages
```

### OpenSwan IPSec

To check that OpenSwan IPSec is working as expected run `ipsec verify` this will output similar to below:

```shell
Verifying installed system and configuration files

Version check and ipsec on-path                         [OK]
Libreswan 3.15 (netkey) on 2.6.32-696.3.1.el6.x86_64
Checking for IPsec support in kernel                    [OK]
 NETKEY: Testing XFRM related proc values
         ICMP default/send_redirects                    [NOT DISABLED]

  Disable /proc/sys/net/ipv4/conf/*/send_redirects or NETKEY will act on or cause sending of bogus ICMP redirects!

         ICMP default/accept_redirects                  [NOT DISABLED]

  Disable /proc/sys/net/ipv4/conf/*/accept_redirects or NETKEY will act on or cause sending of bogus ICMP redirects!

         XFRM larval drop                               [OK]
Pluto ipsec.conf syntax                                 [OK]
Hardware random device                                  [N/A]
Checking rp_filter                                      [ENABLED]
 /proc/sys/net/ipv4/conf/default/rp_filter              [ENABLED]
 /proc/sys/net/ipv4/conf/lo/rp_filter                   [ENABLED]
 /proc/sys/net/ipv4/conf/eth0/rp_filter                 [ENABLED]
  rp_filter is not fully aware of IPsec and should be disabled
Checking that pluto is running                          [OK]
 Pluto listening for IKE on udp 500                     [OK]
 Pluto listening for IKE/NAT-T on udp 4500              [OK]
 Pluto ipsec.secret syntax                              [OK]
Checking 'ip' command                                   [OK]
Checking 'iptables' command                             [OK]
Checking 'prelink' command does not interfere with FIPSChecking for obsolete ipsec.conf options                 [OK]
Opportunistic Encryption                                [DISABLED]

ipsec verify: encountered 9 errors - see 'man ipsec_verify' for help
```

If you see the same results as above create the following script to resolve this:

```shell
#!/bin/bash
echo 1 &gt; /proc/sys/net/ipv4/ip_forward
for each in /proc/sys/net/ipv4/conf/*
do
    echo 0 &gt; $each/accept_redirects
    echo 0 &gt; $each/send_redirects
    echo 0 &gt; $each/rp_filter
done
```

Run `ipsec verify` again to make sure all are green, ideally you shouldn't encounter any errors.

## Startup / Shutdown Script

```shell
#!/bin/bash

if ! ifconfig | grep ppp0;
then
        sudo ipsec auto --up L2TP-PSK
        sleep 3
        sudo echo "c vpn-connection" &gt; /var/run/xl2tpd/l2tp-control
fi
if ! route | grep xxx.xxx.xxx.xxx;
then
        sudo route add -net xxx.xxx.xxx.xxx/xx dev ppp0
fi
```

This can then be created as a cron job to make sure the vpn is always up and running.
