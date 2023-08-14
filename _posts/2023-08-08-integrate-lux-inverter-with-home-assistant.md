---
title: Integrating a Lux Power Inverter with Home Assistant
date: 2023-08-08 12:05:51 +0100
categories: [Home Automation]
tags: [home-assistant, lux-powertek, greenlinx, hanchuess]
pin: false
toc: true
comments: true
series: Home Assistant Solar Integration
---

After having solar installed I  wanted to get it integrated into home assistant to enable historical monitoring and also automation around my home.

At this time I haven't implemented any automation, that will come in the future but for now I will show you how I integrated it with Home Assistant and implemented a nice card to display usage

## Lux Inverter Setup

By default, the datalogger plugged into the Lux sends statistics about your inverter to LuxPower in China. This is how their web portal and phone app knows all about you.

We need to configure it to open another port that we can talk to. Open a web browser to your datalogger IP (might have to check your DHCP server to find it) and login with username/password admin/admin. Click English in the top right

{% include post-picture.html img="lux_os_index.png" alt="Lux OS Index" h="200" w="400" shadow="true" align="true" %}

click Network Setting in the menu. You should see the network settings, the top one is populated with LuxPower's server IP Address, the second one we can use.

Configure it to look like the below and save:

{% include post-picture.html img="lux_network_settings.png" alt="Lux Network Settings" h="200" w="400" shadow="true" align="true" %}

After the datalogger reboots, port 8000 on your inverter IP is accessible.

> You should be sure that this port is only accessible via your LAN, and not exposed to the Internet, or anyone can control your inverter.
{: .prompt-warning }

## Home Assistant Integration

For this I use [LuxPython](https://github.com/guybw/LuxPython_DEV) to get access fill out  [this form](https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAFKAG3-4JFUMDRVVVBZWFg2VktEMFZHQktNVzhIWDBPUC4u)

### Install LuxPython

Download the repository and copy the folder **custom_components/luxpower** to home assistant `/config` folder.

Once copied **REBOOT HA** this step is required otherwise it wont work.

### Setup the integration

Open up `Settings > Devices and Services > Add Integration` and search for **LuxPower Inverter**

> If it doesn't show up, clear your browser cache as it's very likely your browser is the issue!
{: .prompt-tip }

{% include post-picture.html img="lux_integration_search.png" alt="" h="200" w="400" shadow="true" align="true" %}

Fill in your IP, Port (8000), dongle serial and inverter serial

> This can be found on the Lux website at server.luxpowertek.com
{: .prompt-tip }

{% include post-picture.html img="lux_integration_config.png" alt="" h="200" w="400" shadow="true" align="true" %}

Once you have added this into HA, you should see some sensors in HA:

{% include post-picture.html img="lux_integration_added.png" alt="" h="200" w="400" shadow="true" align="true" %}

Use Developer Tools to view `sensor.luxpower`. Initially, the state will be **Waiting** but after a few minutes when the inverter pushes an update the state will change to **ONLINE** and data will be populated in the attributes.

### Manual Refresh

To manually refresh data, add the following button to the dashboard:

```yaml
show_name: true
show_icon: true
type: button
tap_action:
  action: call-service
  service: luxpower.luxpower_refresh_registers
  service_data:
    dongle: BA********
  target: {}
entity: ''
icon_height: 50px
icon: mdi:cloud-refresh
name: Refresh LUX Data
show_state: false
```

{: title='Refresh Button'}

> replace `BA********` with your dongle serial
{: .prompt-note }

### Inverter disconnects often

The inverter dongle often disconnects, to solve the issue of data not flowing please import the [reconnection blueprint](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https://github.com/guybw/LuxPythonCard/blob/main/blueprints/automation/luxpower/reconnect.yaml).

It will allow you to reconnect if the inverter doesn't report for X minutes (I would set it to 20 minutes but absolutely no lower than 10)

## Conclusion

If you have followed all of this, you should now have your Lux inverter linked to home assistant and have your usage visible on the dashboard card.

If you have any problems let me know in the comments section or discord and I will assist where possible.
