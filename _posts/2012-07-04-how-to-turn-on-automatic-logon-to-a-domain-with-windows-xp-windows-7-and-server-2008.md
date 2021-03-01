---
title: How to turn on automatic logon to a domain with Windows XP, Windows 7 and Server 2008
date: 2012-07-04
layout: post
---
I had a requirement for some of our security camera servers to login automatically now on a normal standalone computer this is easy but on a domain it gets more complicated.
<!--more-->

So how did I overcome this?

I found a very useful[ Microsoft KB article](http://support.microsoft.com/kb/315231) and adapted it to work with a domain account, see below for my adapted version.

  1. Click **Start**, click **Run**, type **regedit**, and then click **OK**.
  2. Locate the following registry key:
  ```
  HKEY\_LOCAL\_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon
  ```
  3. Double click **DefaultDomainName**, and type your domain name in here, Click **OK**
  4. Double click **DefaultUserName**, and type your username in here, Click **OK**
  5. Double click **DefaultPassword**, and type your password in here, Click OK
  6. Double click the **AutoAdminLogon** entry, type **1** in the **Value Data** box, and then click **OK**.
  7. If any of the above done exist create them as below
      1. In Registry Editor, click **Edit**, click **New**, and then click **String Value**.
      2. Type **<KeyName>** as the value name, and then press ENTER.
      3. Double-click the newly created key, and then type your password in the **Value Data** box.
  8. Restart the computer / server and watch it logon!
