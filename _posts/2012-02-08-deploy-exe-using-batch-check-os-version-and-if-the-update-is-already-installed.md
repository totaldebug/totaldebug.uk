---
title: Deploy .exe using batch check os version and if the update is already installed.
date: 2012-02-08
layout: post
---
OK so I had an issue that Microsoft released an update for Windows XP that I needed to install but they didn&#8217;t do an MSI so I couldn&#8217;t deploy is using GPO which was a real pain.
<!--more-->

Instead I created a script that would check the OS Version and see if the update was already installed.

  1. First we hide the script from users:
    ```
    @ECHO Off
    ```
  2. Then we check they are running the correct OS (for windows 7 &#8220;Version 6.1&#8221;)
    ```
    ver | find "Windows XP" >NUL
    if errorlevel 1 goto end
    ```
  3. Check to see if the update is installed (chance the reg location depending on the install)
    ```
    reg QUERY &#8220;HKEY\_LOCAL\_MACHINE\SOFTWARE\Microsoft\Updates\Windows XP\SP20\KB943729&#8221; >NUL 2>NUL
    if errorlevel 1 goto install_update
    goto end
    ```
  4. Then if it is the correct OS and the update isn&#8217;t installed run the exe
    ```
    :install_update
    \\PUT\_YOUR\_SHARE\_PATH\_HERE\Windows-KB943729-x86-ENU.exe /passive /norestart
    ```
  5. End (this is added so that the script will stop if the criteria are not met before the update is installed stopping errors.
    ```
    :end
    ```
  6. you can then add this to a group policy to allow it to be deployed
