---
title: Hell Let Loose, better performance and visibility settings
date: 2023-08-18 10:14:35 +0100
categories: [Gaming]
tags: [hell let loose, hll, performance, visibility]
pin: false
toc: true
comments: true
---

For anyone playing Hell Let Loose, you will have come across the annoyance of never being able to spot your enemy but they always seem to get you, Well the chances are they were using the settings I'm about to share with you.

## Launch Options

First open steam, right click on Hell Let Loose and select Properties.

Enter the following in the launch options:

```shell
-dx12 -USEALLAVAILABLECORES
```

This will force the game to use DirectX 12 which will help increase FPS and force the game to  use all of the available CPU Cores, by default the game will only use one single core which will limit the performance available.

### Other Options

There are other options recommended in other articles, however I don't recommend setting these as they wont assist in the performance and in some cases could make it worse.

```shell
-refresh 75 --malloc=system
```

## Power Plan

Changing the power plan to high performance wont increase the performance, but will increase your power consumption, this will basically tell the computer to always keep the resources available even when not needed for games etc. so is unnecessary.

## Nvidia Users

For Nvidia users there are some additional options available which will give you the overall advantage to an AMD user.

To do this:

1. right click desktop > nvidia control panel
1. Go to Manage 3D Settings
1. Select Program Settings tab
1. Select the program `Hell Let Loose` you may need to add this manually via the add button.
1. Update the following settings
    1. **Power Management Mode** - Prefer Maximum Performance
    1. **Texture filtering - Quality** - High Performance
    1. **Vertical Sync** - Off

{% include post-picture.html img="nvidia_settings.png" alt="Nvidia Settings" h="200" w="400" shadow="true" align="true" %}

## Game Settings

These settings are to squeeze out the most FPS out of the game and the highest visibility we can get.

### Gameplay Tab

1. **Dead bodies despawn delay** - 0.5 min

#### Optional

These optional settings are down to personal preference but this is how I set mine up:

1. **Hud Display Mode** - Always On
1. **Player Nameplate Opacity** - 70% / 75% this helps it not get in the way of players in front.

### Video Tab

1. **Brightness** - 130%, but change this for what works for you.
1. **Texture Quality** - Low
1. **Shadow Quality** - Low
1. **Anti-Aliasing Method** - Community TAA
1. **Anti-Aliasing Quality** - High, Anything lower will make things blurred
1. **FX Quality** - Low, makes it easier to see enemies through smokes / fires etc.
1. **View Distance** - High
1. **Foliage Quality** - Medium, any higher and additional bushes will be rendered making it harder to spot enemies in bushes etc.
1. **Postprocess Quality** - Medium
1. **SSAO** **Motion Blur** - Off

## Is this cheating?

> The following settings should probably be blocked by the developers but at this time are not against the rules of
{: .prompt-info }

Some people argue that changes outside of the game could be construed as cheating, the reason being that you are modifying the settings further than what the game developers intended.

However, using every advantage available to you without modifying the game through another program e.g. aimbots etc. in my eyes is just being smart. Also if all other competitive teams use all the advantages available to them, then you should be too.

## Additional Nvidia Settings

Go back into the Nvidia control panel, but this time into the **Adjust desktop color settings** tab.

> Be aware these settings will change across the whole computer and not just whilst in the game
{: .prompt-info }

1. **Digital Vibrance** - 65% / 70%, change this to preferred value

### In Game Filters

If you have Nvidia Geforce Experience installed you are able to take advantage on the In Game filters.

Adding these filters is very much personal preference, however below are the settings that I use which I feel work quite well:

1. Press Alt-z or Alt-F3
1. Game Filters
1. Add Filter
1. Brightness / Contrast
    1. Exposure - 10%
    1. Contrast - 15%
    1. Shadows - -10%
1. Colour
    1. Temperature - -11.6%
    1. Vibrance - 10.5%
1. Details
    1. Sharpen - 22%
    1. Clarity - 100%
    1. HDR Cloning - 61%

> Tarkov have asked Nvidia to remove the game from these filters, so it is likely that HLL may also follow this and remove this ability in the future
{: .prompt-warning }

## Final Thoughts

Some of these settings are quite controversial and some players class this as cheating, however until HLL make changes to ban these settings, other players will be using them and will always have an advantage over you.

Let me know if you have any additional settings to assist with visibility of HLL
