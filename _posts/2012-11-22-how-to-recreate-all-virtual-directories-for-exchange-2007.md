---
id: 177
title: How to recreate all Virtual Directories for Exchange 2007
date: 2012-11-22T10:16:46+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=177
permalink: /how-to-recreate-all-virtual-directories-for-exchange-2007/
post_views_count:
  - "3262"
  - "3262"
slide_template:
  - ""
categories:
  - Exchange
tags:
  - "2007"
  - directories
  - exchange
  - virtual
---
Here you will find all commands what would help you to recreate all Virtual Directories for Exchange 2007. You can also use just a few of them. But never delete or create it in IIS. This has to be done under Exchange Management Shell (don&#8217;t get mixed with the Windows Powershell):  
<!--more-->

Here you will find all commands what would help you to recreate all Virtual Directories for Exchange 2007. You can also use just a few of them. But never delete or create it in IIS. This has to be done under Exchange Management Shell (don&#8217;t get mixed with the Windows Powershell):

**First you shall write down the information what you will get (for example: if it &#8220;Default Web Site&#8221; or &#8220;SBS Web Applications&#8221; and if they have the information, what INTERNURL or External URL is configured)**:

&#8211; Open Exchange Management Shell with **elevated permission**  
&#8211; Run the following commands:

Get-AutodiscoverVirtualDirectory  
Get-OABVirtualDirectory  
Get-OWAVirtualDirectory  
Get-WebServicesVirtualDirectory  
Get-ActiveSyncVirtualDirectory  
Get-UMVirtualDirectory

Then you can remove the Virtual Directories but change the XXXXXXX to the information you got earlier**(AND DON&#8217;T JUST COPY AND PASTE INTO POWERSHELL! COPY IT INTO NOTEPAD AND THEN READ THE COMMAND AND CHANGE SERVERNAME OR OTHER RELATED INFORMATION)**

Remove-OWAVirtualDirectory -Identity &#8220;Owa (XXXXXXX)&#8221; -Confirm:$false  
Remove-OWAVirtualDirectory -Identity &#8220;Exadmin (XXXXXXX)&#8221; -Confirm:$false  
Remove-OWAVirtualDirectory -Identity &#8220;Exchange (XXXXXXX)&#8221; -Confirm:$false  
Remove-OWAVirtualDirectory -Identity &#8220;Exchweb (XXXXXXX)&#8221; -Confirm:$false  
Remove-OWAVirtualDirectory -Identity &#8220;Public (XXXXXXX)&#8221; -Confirm:$false  
Remove-WebServicesVirtualDirectory -Identity &#8220;EWS (XXXXXXX)&#8221; -Confirm:$false  
Remove-ActiveSyncVirtualDirectory -Identity &#8220;Microsoft-Server-ActiveSync (XXXXXXX)&#8221; -Confirm:$false  
Remove-OabVirtualDirectory -Identity &#8220;OAB (XXXXXXX)&#8221; -Force:$true -Confirm:$false  
Remove-UMVirtualDirectory -Identity &#8220;UnifiedMessaging (XXXXXXX)&#8221; -Confirm:$false  
Remove-AutodiscoverVirtualDirectory -Identity &#8220;Autodiscover (XXXXXXX)&#8221; -Confirm:$false

To verify that the directories have been removed, run the following commands. You should receive no output:

Get-AutodiscoverVirtualDirectory  
Get-OABVirtualDirectory  
Get-OWAVirtualDirectory  
Get-WebServicesVirtualDirectory  
Get-ActiveSyncVirtualDirectory  
Get-UMVirtualDirectory

To properly create these virtual directories, run the following commands (Please keep the information what you got earlier for XXXXXXX and change it here to):

&#8211; Open Exchange Management Shell with elevated permission  
&#8211; Run the following commands (**THE COMMANDS ARE A ONE-LINER. THE NEXT COMMAND IS SEPERATED WITH &#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;. So copy and paste it into notepad, check if it is one line, read it carefully and change the information you have to provide. Information you have to provide is in BIG LETTERS or XXXXXXX)**:

New-OWAVirtualDirectory -WebsiteName &#8220;XXXXXXX&#8221; -OwaVersion &#8220;Exchange2007&#8221;  
-ExternalAuthenticationMethods Fba  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
Set-OWAVirtualDirectory -InternalUrl &#8220;<a href="https://internal_fqdn_of_exchange/owa/" rel="nofollow" target="_blank">https://INTERNAL_FQDN_OF_EXCHANGE/owa/</a>&#8221;  
-ClientAuthCleanupLevel &#8220;Low&#8221; -LogonFormat &#8220;UserName&#8221; -DefaultDomain “NETBIOSDOMAINNAME”  
-Identity &#8220;Owa (XXXXXXX)&#8221;  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
New-OWAVirtualDirectory -WebsiteName &#8220;XXXXXXX&#8221; -OwaVersion &#8220;Exchange2003or2000&#8221;  
-VirtualDirectoryType &#8220;Exadmin&#8221; -ExternalAuthenticationMethods Fba  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
New-OWAVirtualDirectory -WebsiteName &#8220;XXXXXXX&#8221; -OwaVersion &#8220;Exchange2003or2000&#8221;  
-VirtualDirectoryType &#8220;Mailboxes&#8221; -ExternalAuthenticationMethods Fba  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
New-OWAVirtualDirectory -WebsiteName &#8220;XXXXXXX&#8221; -OwaVersion &#8220;Exchange2003or2000&#8221;  
-VirtualDirectoryType &#8220;Exchweb&#8221; -ExternalAuthenticationMethods Fba  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
New-OWAVirtualDirectory -WebsiteName &#8220;XXXXXXX&#8221; -OwaVersion &#8220;Exchange2003or2000&#8221;  
-VirtualDirectoryType &#8220;PublicFolders&#8221; -ExternalAuthenticationMethods Fba  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
New-WebServicesVirtualDirectory -WebsiteName &#8220;XXXXXXX&#8221;  
-InternalUrl &#8220;<a href="https://internal_fqdn_of_exchange/EWS/Exchange.asmx" rel="nofollow" target="_blank">https://INTERNAL_FQDN_OF_EXCHANGE/EWS/Exchange.asmx</a>&#8221; -basicauthentication 1  
-windowsauthentication 1  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
New-ActiveSyncVirtualDirectory -WebsiteName &#8220;XXXXXXX&#8221;  
-InternalUrl &#8220;<a href="https://internal_fqdn_of_exchange/Microsoft-Server-ActiveSync" rel="nofollow" target="_blank">https://INTERNAL_FQDN_OF_EXCHANGE/Microsoft-Server-ActiveSync</a>&#8221;  
-ExternalAuthenticationMethods Basic -InternalAuthenticationMethods Basic  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
New-OabVirtualDirectory -WebsiteName &#8220;XXXXXXX&#8221; -InternalUrl &#8220;<a href="https://internal_fqdn_of_exchange/OAB" rel="nofollow" target="_blank">https://INTERNAL_FQDN_OF_EXCHANGE/OAB</a>&#8221;  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
Set-OabVirtualDirectory -PollInterval &#8220;30&#8221; -Identity &#8220;oab (XXXXXXX)&#8221;  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
New-UMVirtualDirectory -WebsiteName &#8220;XXXXXXX&#8221;  
-InternalUrl &#8220;<a href="https://internal_fqdn_of_exchange/UnifiedMessaging/Service.asmx" rel="nofollow" target="_blank">https://INTERNAL_FQDN_OF_EXCHANGE/UnifiedMessaging/Service.asmx</a>&#8221;  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
New-AutodiscoverVirtualDirectory -WebsiteName &#8220;XXXXXXX&#8221;  
-InternalUrl &#8220;<a href="https://internal_fqdn_of_exchange/Autodiscover/Autodiscover.xml" rel="nofollow" target="_blank">https://INTERNAL_FQDN_OF_EXCHANGE/Autodiscover/Autodiscover.xml</a>&#8221;  
-BasicAuthentication 1 -WindowsAuthentication 1  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
Set-ClientAccessServer -Identity “Servername”  
-AutoDiscoverServiceInternalUri &#8220;<a href="https://internal_fqdn_of_exchange/Autodiscover/Autodiscover.xml" rel="nofollow" target="_blank">https://INTERNAL_FQDN_OF_EXCHANGE/Autodiscover/Autodiscover.xml</a>&#8221;  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
Set-OfflineAddressBook &#8220;Default Offline Address Book&#8221;  
-VirtualDirectories &#8220;Servername\OAB (XXXXXXX)&#8221; -Versions Version2,Version3,Version4)&#8221;

&#8211; To check if we were successful in creating the virtual directories correctly type in the commands:

Get-AutodiscoverVirtualDirectory  
Get-OABVirtualDirectory  
Get-OWAVirtualDirectory  
Get-WebServicesVirtualDirectory  
Get-ActiveSyncVirtualDirectory  
Get-UMVirtualDirectory

For example, you should receive the following for Get-OWAVirtualDirectory

Name Server OwaVersion  
&#8212;&#8212;&#8211; &#8212;&#8212;- &#8212;&#8212;&#8212;&#8211;

Owa (XXXXXXX) Server Name Exchange2007  
Exadmin (XXXXXXX) Server Name Exchange2003or2000  
Public (XXXXXXX) Server Name Exchange2003or2000  
Exchweb (XXXXXXX) Server Name Exchange2003or2000  
Exchange(XXXXXXX) Server Name Exchange2003or2000

&#8211; Then run the following commands to disable the Kernel Mode Authentication on EWS, Autodiscover, and OAB virtual directories (**THE COMMANDS ARE A ONE-LINER. THE NEXT COMMAND IS SEPERATED WITH &#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;. So copy and paste it into notepad, check if it is one line, read it carefully and change the information you have to provide. Information you have to provide is in BIG LETTERS or XXXXXXX)**:

cd $env:windir\system32\inetsrv  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;-  
.\appcmd.exe unlock config &#8220;-section:system.webserver/security/authentication/windowsauthentication&#8221;  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
.\appcmd.exe set config &#8220;XXXXXXX/ews&#8221; &#8220;-section:windowsAuthentication&#8221; &#8220;-useKernelMode:False&#8221; /commit:apphost  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
.\appcmd.exe set config &#8220;XXXXXXX/AutoDiscover&#8221; &#8220;-section:windowsAuthentication&#8221; &#8220;-useKernelMode:False&#8221; /commit:apphost  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
.\appcmd.exe set config &#8220;XXXXXXX/oab&#8221; &#8220;-section:windowsAuthentication&#8221; &#8220;-useKernelMode:False&#8221; /commit:apphost

&#8211; Run: iisreset /noforce

&#8211; You must rerun the Internet Address Management Wizard to stamp the new virtual directories with the proper external URL and maybe you have to check the certificates.

======================================  
Troubleshooting for useKernelMode

%windir%\system32\inetsrv\appcmd.exe set config /section:system.webServer/security/authentication/windowsAuthentication /useKernelMode:false

With the following command you should see something like this:  
%windir%\system32\inetsrv\appcmd.exe list config /section:system.webServer/security/authentication/windowsAuthentication