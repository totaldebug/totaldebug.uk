---
id: 6317
title: CentOS 8 Teaming with WiFi Hidden SSID using nmcli
date: 2019-11-02T13:33:29+00:00
author: marksie1988
layout: post
guid: http://spottedhyena.co.uk/?p=6317
permalink: /centos-8-teaming-with-wifi-hidden-ssid-using-nmcli/
ct_author_last_updated:
  - default
categories:
  - Uncategorized
---
I have had a lot of issues when setting up teaming with WiFi, mainly because of lack of documentation around this, im guessing that teaming ethernet and WiFi is not a common occurrence especially with a hidden SSID. 

As part of my home systems I am utilising an old laptop as my home assistant server, this allows for battery backup and network teaming, if my switch dies, my WiFi will still work etc. 

## Lets get to the meat and potatoes! 

So the first thing that we need to do is check our devices are available:

<pre class="wp-block-code"><code>]# nmcli d status
DEVICE   TYPE      STATE      CONNECTION
eno1     ethernet  connected  Ethernet connection 1
wlp3s0   wifi      connected  Wi-Fi connection 1
lo       loopback  unmanaged  --
</code></pre>

Now that we see all our devices (they may not all be listed as connected yet) we can create our team:

<pre class="wp-block-code"><code>]# nmcli c a type team con-name team0 
Connection 'team-TeamA' (4387966d-715b-4636-b307-03d2b92476bf) successfully added.
</code></pre>

NetworkManager will set its internal parameter **_connection.autoconnect_** to yes and as no IP address was given **_ipv4.method_** will be set to auto. NetworkManager will also write a configuration file to /etc/sysconfig/network-scripts/ifcfg-team-TeamA where the corresponding **ONBOOT** will be set to yes and **BOOTPROTO** will be set to dhcp.

Now if we show the connections we should see team0 listed:

<pre class="wp-block-code"><code>]# nmcli c show
NAME                   UUID                                  TYPE      DEVICE
Ethernet connection 1  520e1441-f8d9-43c1-8c3d-a0d56227b6b9  ethernet  eno1
Wi-Fi connection 1     ddef5993-b469-4916-961d-3082b1f41ec1  wifi      wlp3s0
team0                  c742d9e4-73ec-4506-82ff-b2a93727cc3a  team      nm-team
</code></pre>

Currently the team isnt doing anything, so we need to add our ethernet interface:

<pre class="wp-block-code"><code>]# nmcli c a type team-slave ifname eno1 master team0
Connection 'team-slave-eno1' (d2f0f253-0b42-4fdb-828b-c983b7ad59f4) successfully added.</code></pre>

Once done if we show the connections again we will see the two team-slaves:

<pre class="wp-block-code"><code>NAME                   UUID                                  TYPE      DEVICE
Ethernet connection 1  520e1441-f8d9-43c1-8c3d-a0d56227b6b9  ethernet  eno1
Wi-Fi connection 1     ddef5993-b469-4916-961d-3082b1f41ec1  wifi      wlp3s0
team0                  c742d9e4-73ec-4506-82ff-b2a93727cc3a  team      nm-team1
team-slave-eno1        d2f0f253-0b42-4fdb-828b-c983b7ad59f4  ethernet  --
</code></pre>

These commands automatically create corresponding files for the team under: 

<pre class="wp-block-code"><code>/etc/sysconfig/network-scripts/ifcfg-team0
/etc/sysconfig/network-scripts/ifcfg-team-slave-en01</code></pre>

<div class="wp-block-simple-note-info">
  If you edit these files manually, you will need to run nmcli con reload so that network manager reads the config changes.
</div>

The team is now setup&#8230; however it is recommended to use a static IP Address, we can manually specify this by running the below commands: 

<pre class="wp-block-code"><code>nmcli c m team0 ipv4.method manual
nmcli c m team0 ipv4.addresses 10.10.10.20/24
nmcli c m team0 ipv4.gateway 10.10.10.1
nmcli c m team0 ipv4.dns 10.10.10.1
, 1.1.1.1</code></pre>

## Enabling the team

To enable the team we must bring up our Ethernet interface with this command: 

<pre class="wp-block-code"><code>]# nmcli c up team-slave-eno1
Connection successfully activated (D-Bus active path: /org/freedesktop/NetworkManager/ActiveConnection/5)</code></pre>

## What about the WiFi? 

So we have setup our connections and our team with an IP Address, however we havent specified any WiFi configurations at all, so lets do that&#8230;

First lets make sure the wifi module is installed, by default this isn&#8217;t: 

<pre class="wp-block-code"><code>dnf install NetworkManager-wifi
systemctl restart NetworkManager</code></pre>

We can discover any wifi in the area by running: 

<pre class="wp-block-code"><code>]# nmcli d wifi list
IN-USE  SSID                   MODE   CHAN  RATE        SIGNAL  BARS  SECURITY
        my_wifi_net            Infra  1     195 Mbit/s  34      ▂▄__  WPA2
</code></pre>

to connect to one of these networks simply type:

<pre class="wp-block-code"><code>nmcli d wifi connect my_wifi_net password &lt;wifi-password></code></pre>

### Hidden WiFi Network

A hidden network is a standard WiFi network that doesnt broadcast its SSID, this means that its name cannot be searched and must be known in order to configure it.

To do this we must enter the following commands: 

<pre class="wp-block-code"><code>nmcli c a type 802-11-wireless ifname wlp3s0 master team0 utoconnect yes ssid &lt;your-Wifi-SSID> 802-11-wireless-security.key-mgmt wpa-psk 802-11-wireless-security.psk &lt;wifi-password> 802-11-wireless.hidden yes</code></pre>

<div class="wp-block-simple-note-info">
  wlp3s0 may be different in your command, it will depend what your wireless slave connection is called
</div>

Now that we have our wifi interface connected and configured we can bring it online with the below command

<pre class="wp-block-code"><code>]# nmcli c up team-slave-wlp3s0
Connection successfully activated (D-Bus active path: /org/freedesktop/NetworkManager/ActiveConnection/6)</code></pre>

After you have brought the connections up your team should automatically come online, to test you can run the following: 

<pre class="wp-block-code"><code>This command will list the team and connections, all should be up and the team should show an IP Address
]# ip a

This command will show all your connections, the ones for the team should all be green
]# nmcli c </code></pre>

I would also recommend doing some testing with the team to make sure it functions as expected, I normally run a continuous ping and then disconnect one of the interfaces, if all is well you should only see increased latency for one ping or a single dropped ping. 

## Modifying the team

When we first setup a team it will default to **_roundrobin_** this can be seen by running the below command: (substitute nm-team with your team)

<pre class="wp-block-code"><code>]# teamdctl nm-team state
setup:
  runner: roundrobin
ports:
  eno1
    link watches:
      link summary: up
      instance[link_watch_0]:
        name: ethtool
        link: up
        down count: 0
  wlp3s0
    link watches:
      link summary: up
      instance[link_watch_0]:
        name: ethtool
        link: up
        down count: 0
</code></pre>

This shows the **runner** which is how the traffic is managed across the interfaces, we can also see the interfaces that are part of the team, along with their states. 

The possible runners are: 

  * **roundrobin:** This is the default option, it will send packets to all interfaces one at a time per interface, in a round robin manner
  * **broadcast:** All traffic will be sent over all ports
  * **activebackup:** One interface will be used as the Active interface and the rest as a backup, the team will monitor for failures and automatically failover the link should one go offline
  * **loadbalance:** Traffic will be balanced across all interfaces based on Tx traffic, the load should be equal across all interfaces

You can change the runner that you are using when you create the team:

<pre class="wp-block-code"><code>]# nmcli c a type team con-name team0 config '{"runner": {"name": "broadcast"}, "link_watch": {"name": "ethtool"}}'</code></pre>

or you can modify the connection with this command:

<pre class="wp-block-code"><code>]# nmcli c m team0 config  '{"runner": {"name": "broadcast"}, "link_watch": {"name": "ethtool"}}'</code></pre>

once the above command is run a reboot will be required to apply the changes, now we can confirm the changes using: 

<pre class="wp-block-code"><code>]# teamdctl nm-team state
setup:
  runner: broadcast
ports:
  eno1
    link watches:
      link summary: up
      instance[link_watch_0]:
        name: ethtool
        link: up
        down count: 0
runner:
  active port: eno1
</code></pre>

<div class="wp-block-simple-note-info">
  more information on runners can be found <a href="https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/networking_guide/sec-configure_teamd_runners">here </a>
</div>