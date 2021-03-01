---
title: Graylog2 Cisco ASA / Cisco Catalyst
date: 2015-01-21
layout: post
---
In order to correctly log Cisco device in Graylog2 setup the below configuration.
<!--more-->

This has now been added to the Graylog Marketplace [https://marketplace.graylog.org/](https://marketplace.graylog.org/addons/90396261-812c-4fa8-ad8f-a17771c9f8e0)

Cisco ASA Configuration:

```sh
logging enable
logging trap informational
logging asdm informational
logging device-id hostname
logging host <network> <ip-address> <udp-tcp>/<port>
```

Create a Raw/PlainText input with the settings you require.

Then select action -> Manage Extractors.

Now select actions -> Import Extractors, in the box add the below configuration. This will format the messages correctly with the IP Address of the firewall as the source.

If you would like the Source to be the IP Address Change this line:

```sh
"regex_value": ">(.+?)%"
```

To this:

```sh
"regex_value": "&gt;: (.+?):"
```

[Cisco-ASA-Extractor.json](https://raw.githubusercontent.com/SpottedHyenaUK/Graylog-Cisco-ASA-Extractor/master/Cisco-ASA-Extractor.json)
