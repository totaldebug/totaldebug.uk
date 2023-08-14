---
title: Integrate Solcast API with Home Assistant
date: 2023-08-14 10:14:35 +0100
categories: [Home Automation]
tags: [home-assistant, solcast]
pin: false
toc: true
comments: true
series: Home Assistant Solar Integration
---

As I further integrate my solar solution into my home, I have now added the Solcast API.

This API Allows you to plan your PV usage and if you should use cheap rate grid power to charge batteries in preparation for a low solar day, also with the use of specific Home Assistant cards, you can see how much solar is left for the day.

## Setup

Head over to [Solcast](https://solcast.com/) and create a new account, selecting the **home user** option.

Once an account is created and have verified, login and add a new site:

{% include post-picture.html img="solcast-home.png" alt="Solcast Hom Setup" h="200" w="400" shadow="true" align="true" %}

It is not currently possible to implement two strings or two azimuth's into the API, so I added two sites, one for East and one for West as I have two strings of 12 panels East and West facing.

## Solcast PV solar HA integration

In order to see the data in Home Assistant add the following integration [Solcast PV Solar](https://github.com/oziee/ha-solcast-solar) OR if using HACS add a custom repository **oziee/ha-solcast-solar** and install the integration.

In Home Assistant go to **Settings -> Devices & Services -> Add Integration** search for **Solcast PV Forecast** and select it, when prompted enter the API key from the [solcast website](https://toolkit.solcast.com.au/account/api-key)

This will then add the following entities to HA:

{% include post-picture.html img="solcast-entities.png" alt="Solcast Entities" h="200" w="400" shadow="true" align="true" %}

