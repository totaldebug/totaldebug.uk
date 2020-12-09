---
title: How to Make the Shutdown Button Unavailable by Using Group Policy
excerpt: >-
  You can use Group Policy Editor to make the **Shutdown** button unavailable in the **Log On to Windows** dialog box that appears when you press
  CTRL+ALT+DELETE on the Welcome to Windows screen.
date: '2011-07-08'
author: marksie1988
layout: post
permalink: /how-to-make-the-shutdown-button-unavailable-by-using-group-policy/
categories:
  - GPO
tags:
  - group policy
  - shutdown
---
You can use Group Policy Editor to make the **Shutdown** button unavailable in the **Log On to Windows** dialog box that appears when you press
CTRL+ALT+DELETE on the Welcome to Windows screen.

#### To Edit the Local Policy on a Windows 2000-Based Computer

To
make the **Shutdown** button unavailable on a standalone Windows
2000-based computer:

  1. Click **Start**,
    and then click **Run**.
  2. In the **Open** box, type gpedit.msc, and then click **OK**.
  3. Expand **Computer
    Configuration**, expand **Windows Settings**, expand **Security
    Settings**, expand **Local Policies**, and then click **Security
    Options**.
  4. In the right pane, double-click **Shutdown:****Allow
    system to be shut down without having to log on**.
  5. Click **Disabled**, and then click **OK**.**NOTE**: If domain-level policy settings are
    defined, they may override this local policy setting.
  6. Quit Group Policy Editor.
  7. Restart the computer.

#### To Edit the Group Policy in a Domain {#tocHeadRef}

To edit a domain-wide
policy to make the **Shutdown**button unavailable::

  1. Start the Active Directory Users and
    Computers snap-in. To do this, click **Start**, point to**Programs**, point to **Administrative Tools**, and then click **Active Directory Users and Computers**.
  2. In the console, right-click your domain, and
    then click **Properties**.
  3. Click the **Group
    Policy**tab.
  4. In the **Group Policy Object Links** box, click the group policy for which you
    want to apply this setting. For example, click **Default
    Domain Policy**.
  5. Click **Edit**.
  6. Expand **User
    Configuration**, expand **Administrative Templates**, and then click**Start Menu & Taskbar**.
  7. In the right pane, double-click **Disable and remove the Shut Down command**.
  8. Click **Enabled**, and then click **OK**.
  9. Quit the Group Policy editor, and then
    click **OK**.

### Troubleshooting {#tocHeadRef}

Group Policy changes are not immediately
enforced. Group Policy background processing can take up to 5 minutes to be
refreshed on domain controllers, and up to 120 minutes to be refreshed on client
computers. To force background processing of Group Policy settings, use the
Secedit.exe tool. To do this:

  1. Click **Start**,
    and then click **Run**.
  2. In the **Open** box, type cmd, and then click **OK**.
  3. Type secedit /refreshpolicy user_policy, and then press ENTER.
  4. Type secedit /refreshpolicy machine_policy, and then press
    ENTER.
  5. Type exit, and then press ENTER to quit the command prompt.
