---
title: Ubiquiti UniFi USG Content Filter Configuration
date: '2019-09-17'
layout: post
---
Recently I had a requirement to setup a content filter on the USG for a client. I couldn&#8217;t find much information online so have decided to write this article to show others how to do this

First we need to logon to the USG via SSH, On windows I recommend [Putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)

Once we have logged in, run the below command:

```
update webproxy blacklists
```

*This will download all of the content filter categories to the USG, this can take some time as there is approx. 100MB (70-80MB is &#8220;adult&#8221;)*

When this is completed run the following:

```
configure
set service webproxy url-filtering squidguard block-category &lt;insert caregory&gt;
```

*This will set the categories that you wish to block, repeating the command will add more categories. pressing ? will display a list of all available categories*

We now need to set the web proxy listener address for the network we wish to filter:

```
set service webproxy listen-address &lt;-usg-lan-ip-&gt;
```

You are also able to set a redirect URL:

```
set service webproxy url-filtering squidguard redirect-url &lt;url&gt;
```

*The redirect URL is google.com by default, however you could create a custom &#8220;Blocked Website&#8221; page to make users aware.*

Now we need to commit these changes to the USG:

```
commit
```

The below example shows how we set this up on the network 10.10.10.1/24

```
configure
set service webproxy url-filtering squidguard block-category adult
set service webproxy listen-address 10.10.10.1
set service webproxy url-filtering squidguard redirect-url spottedhyena.co.uk
commit
```

To make this a permanent change you can create a configuration file on the controller, run the command:

```
mca-ctrl -t dump-cfg
```

Find the &#8220;service&#8221; section and delete all content other than the web proxy, it should looks similar to below:

```
"service": {
        "webproxy": {
                "cache-size": "0",
                "default-port": "3128",
                "listen-address": {
                        "10.10.10.1": "''"
                },
                "mem-cache-size": "5",
                "url-filtering": {
                        "squidguard": {
                                "block-category": [
                                        "adult"
                                ],
                                "default-action": "allow",
                                "redirect-url": "http://spottedhyena.co.uk"
                        }
                }
        }
}
```

Save this information into a file on your controller

  * File Location: /opt/UniFi/data/sites/[site name/default]/
  * File Name: config.gateway.json

once you have done this whenever you make any changes to your USG the Content Filtering will be re-applied.

Hopefully this article has assisted you with your configuration. Any questions please let me know.
