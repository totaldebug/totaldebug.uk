---
title: Setup the Sunsynk Power Flow Card with a Lux Inverter
date: 2023-08-14 10:14:35 +0100
categories: [Home Automation]
tags: [home-assistant, sunsynk, lovelace]
pin: false
toc: true
comments: true
series: Home Assistant Solar Integration
---

If you haven't already, I recommend going back to the [first article]({% post_url 2023-08-08-integrate-lux-inverter-with-home-assistant %}) in the series and following it through otherwise some options in this article may not work as expected.

## Card Install

The card can be installed via HACS with [this link](https://my.home-assistant.io/redirect/hacs_repository/?repository=sunsynk-power-flow-card&category=plugin&owner=slipx06)

Or if you dont use HACS, a manual installation can be found [here](https://github.com/slipx06/sunsynk-power-flow-card)

## Configuration

Add the `Custom: Sunsynk Power Flow Card` to your Dashboard view with the following base configuration:

{% gist 1b03d5edb60b61e25451f0406e8a7933 %}

### System specific settings

Some of these settings will need to be adjusted based on the solar system it is for:

* battery.energy - This should be the total battery capacity in Watts
* battery.shutdown_soc - This should be the percentage of battery that remains in the system when depleted
* solar.mppts - this is the number of solar arrays in the system
* energy_cost - this will be the entity for your energy provider price, if you don't have this it can be removed

{% include post-picture.html img="card_view.png" alt="" h="200" w="400" shadow="true" align="true" %}
