---
title: Hell Let Loose, better performance and visibility settings
date: 2023-08-18 10:14:35 +0100
categories: [Gaming]
tags: [hell let loose, hll, performance, visibility, nvidia]
pin: false
toc: true
comments: true
---

> This article has been updated to include some new config improvements and remove the nVidia filters as these are now disabled.
{: .prompt-info }

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

## Windows Settings

By default Windows 11 has some settings that can reduce performance

### Game Bar

1. Open Settings
1. Go to **Gaming**
1. Go to **Game Bar**
1. Change **Allow controller to open Game Bar** to Off

### Variable Refresh Rate/ Optimisation for Windows games

This setting made a noticable improvement to my experience in game, before disabling this i would see freezing and stuttering during gameplay

1. Open Settings
1. Go to **Gaming**
1. Click **Graphics**
1. Click **Change default graphics settings**
1. Turn **Variable Refresh Rate** Off
1. Turn **Optimisations for Windows games** Off

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

These settings are to squeeze out the most FPS out of the game and the highest visibility available.

### In-Game changes

#### Gameplay Tab

|          Option           |  Setting  | Note  |
| :-----------------------: | :-------: | :---: |
| Dead bodies despawn delay | `0.5` min |       |

##### Optional

These optional settings are down to personal preference but this is how I set mine up:

|          Option          |    Setting    |                         Note                          |
| :----------------------: | :-----------: | :---------------------------------------------------: |
|     Hud Display Mode     |  `Always On`  |                                                       |
| Player Nameplate Opacity | `70%` / `75%` | This helps it not get in the way of players in front. |

#### Video Tab

|        Option         |     Setting     |                                             Note                                              |
| :-------------------: | :-------------: | :-------------------------------------------------------------------------------------------: |
|      Brightness       |     `130%`      |                          Change this per map to what works for you.                           |
|    Texture Quality    |      `Low`      |                                                                                               |
|    Shadow Quality     |      `Low`      |                                                                                               |
| Anti-Aliasing Method  | `Community TAA` |                                                                                               |
| Anti-Aliasing Quality |     `High`      |                            Anything lower will make things blurred                            |
|      FX Quality       |      `Low`      |                       Easier to see enemies through smokes / fires etc.                       |
|     View Distance     |     `High`      |                                                                                               |
|    Foliage Quality    |    `Medium`     | any higher and additional bushes will be rendered making it harder to spot enemies in bushes. |
|  Postprocess Quality  |    `Medium`     |                                                                                               |
|         SAOO          |      `Off`      |                                                                                               |
|      Motion Blur      |      `Off`      |                                                                                               |

### GameUserSettings.ini File

Some settings cannot be changed in the UI, therefore you would need to edit them in the user ini files

1. Go to `C:\Users\%UserName%\AppData\Local\HLL\Saved\Config\WindowsNoEditor`
   1. If you can't see the **AppData** folder, click on the **View**, select the **Hidden items**
1. Open the `GameUserSettings.ini` file
1. Update the settings listed in the table below:
   |      Option       | Setting |                                  Note                                   |
   | :---------------: | :-----: | :---------------------------------------------------------------------: |
   |  FrameRateLimit   |  `144`  | This should be set to your monitor refresh rate e.g. 120, 144, 240 etc. |
   | sg.ShadowQuality  |   `0`   |                                                                         |
   | sg.FoliageQuality |   `0`   |                                                                         |
1. Save the file
1. Right click the `GameUserSettings.ini` file
1. Click Properties
1. Check Read-Only
1. Click OK

> Make a copy of this file somewhere safe, sometimes updates cause this to be reset
{: .prompt-tip }

## Final Thoughts

At this moment nVidia filters have been disabled at the request of the HLL Devs, this brings back a balance between nVidia and AMD users to stop additional filtering from happening and reduces the advantage nVidia users used to have.

Let me know if you have any additional settings to assist with the performance or visibility of HLL
