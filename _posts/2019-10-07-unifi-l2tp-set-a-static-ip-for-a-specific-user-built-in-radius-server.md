---
title: 'UniFi L2TP: set a static IP for a specific user (built-in Radius Server)'
date: '2019-10-07'
layout: post
---
When using my L2TP VPN with the Unifi I realised that it was assigning a different IP Address to my client when it connected sometimes.

This wouldn&#8217;t normally be a problem if the remote client was only taking to my internal network, however I run a server that my internal network communicates out to via IP Address, so if this changes it all stops working.

This article walks through how to setup a static IP Address for an L2TP Client.

<!--more-->

First we need to get a dump of our configuration from the USG, to do this we need to SSH to the USG and run a dump:

```
mca-ctrl -t dump-cfg
```

Once we have this I recommend copying it into your favourite text editor. We want to delete everything except the following:

```
{
        "service": {
                "radius-server": {
                        "user": {
                                "myl2tpuser": {
                                        "password": "password",
                                        "tunnel-param": "3 1"
                                }
                        }
                }
        }

}
```

Now that we only have our user configuration we need to modify it to assign the IP Address:

```
{
        "service": {
                "radius-server": {
                        "user": {
                                "myl2tpuser": {
                                        "ip-address": "192.168.10.10"
                                }
                        }
                }
        }
}
```

Once we have this we are able to add this to a config file on our controller which, when the controller re-provisions the USG will apply. (you can also manually force a provision)

The file needs to be saved to the site location, this will be something similar to:

```
/opt/UniFi/data/sites/default/
```

once in this directory create a new file called &#8220;config.gateway.json&#8221; and paste the above configuration into it.

To test the new configuration file you can run this command:

```
python -m json.tool config.gateway.json
```

you shouldn&#8217;t see any errors if this is correct.

We now can re-provision the USG which will pickup the configuration from the Controller and update the VPN settings.
