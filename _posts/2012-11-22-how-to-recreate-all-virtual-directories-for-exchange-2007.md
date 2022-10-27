---
title: How to recreate all Virtual Directories for Exchange 2007
date: 2012-11-22
categories: [Microsoft, Exchange]
tags: [exchange, '2007', virtual, directories]
---
Here you will find all commands what would help you to recreate all Virtual Directories for Exchange 2007. You can also use just a few of them. But never delete or create it in IIS. This has to be done under Exchange Management Shell (don&#8217;t get mixed with the Windows Powershell):
<!--more-->

Here you will find all commands what would help you to recreate all Virtual Directories for Exchange 2007. You can also use just a few of them. But never delete or create it in IIS. This has to be done under Exchange Management Shell (don&#8217;t get mixed with the Windows Powershell):

**First you shall write down the information what you will get (for example: if it "Default Web Site" or "SBS Web Applications" and if they have the information, what INTERNURL or External URL is configured)**:

&#8211; Open Exchange Management Shell with **elevated permission**
&#8211; Run the following commands:

```powershell
Get-AutodiscoverVirtualDirectory
Get-OABVirtualDirectory
Get-OWAVirtualDirectory
Get-WebServicesVirtualDirectory
Get-ActiveSyncVirtualDirectory
Get-UMVirtualDirectory
```

Then you can remove the Virtual Directories but change the XXXXXXX to the information you got earlier.

>DON'&#8217;'T JUST COPY AND PASTE INTO POWERSHELL! COPY IT INTO NOTEPAD AND THEN READ THE COMMAND AND CHANGE SERVERNAME OR OTHER RELATED INFORMATION)**
{: .prompt-warning }

```powershell
Remove-OWAVirtualDirectory -Identity "Owa (XXXXXXX)" -Confirm:$false
Remove-OWAVirtualDirectory -Identity "Exadmin (XXXXXXX)" -Confirm:$false
Remove-OWAVirtualDirectory -Identity "Exchange (XXXXXXX)" -Confirm:$false
Remove-OWAVirtualDirectory -Identity "Exchweb (XXXXXXX)" -Confirm:$false
Remove-OWAVirtualDirectory -Identity "Public (XXXXXXX)" -Confirm:$false
Remove-WebServicesVirtualDirectory -Identity "EWS (XXXXXXX)" -Confirm:$false
Remove-ActiveSyncVirtualDirectory -Identity "Microsoft-Server-ActiveSync (XXXXXXX)" -Confirm:$false
Remove-OabVirtualDirectory -Identity "OAB (XXXXXXX)" -Force:$true -Confirm:$false
Remove-UMVirtualDirectory -Identity "UnifiedMessaging (XXXXXXX)" -Confirm:$false
Remove-AutodiscoverVirtualDirectory -Identity "Autodiscover (XXXXXXX)" -Confirm:$false
```

To verify that the directories have been removed, run the following commands. You should receive no output:

```powershell
Get-AutodiscoverVirtualDirectory
Get-OABVirtualDirectory
Get-OWAVirtualDirectory
Get-WebServicesVirtualDirectory
Get-ActiveSyncVirtualDirectory
Get-UMVirtualDirectory
```

To properly create these virtual directories, run the following commands (Please keep the information what you got earlier for XXXXXXX and change it here to):

Open Exchange Management Shell with elevated permission and run the following commands:

```powershell
New-OWAVirtualDirectory -WebsiteName "XXXXXXX" -OwaVersion "Exchange2007" -ExternalAuthenticationMethods Fba
Set-OWAVirtualDirectory -InternalUrl "https://INTERNAL_FQDN_OF_EXCHANGE/owa/" -ClientAuthCleanupLevel "Low" -LogonFormat "UserName" -DefaultDomain "NETBIOSDOMAINNAME" -Identity "Owa (XXXXXXX)"
New-OWAVirtualDirectory -WebsiteName "XXXXXXX" -OwaVersion "Exchange2003or2000" -VirtualDirectoryType "Exadmin" -ExternalAuthenticationMethods Fba
New-OWAVirtualDirectory -WebsiteName "XXXXXXX" -OwaVersion "Exchange2003or2000" -VirtualDirectoryType "Mailboxes" -ExternalAuthenticationMethods Fba
New-OWAVirtualDirectory -WebsiteName "XXXXXXX" -OwaVersion "Exchange2003or2000" -VirtualDirectoryType "Exchweb" -ExternalAuthenticationMethods Fba
New-OWAVirtualDirectory -WebsiteName "XXXXXXX" -OwaVersion "Exchange2003or2000" -VirtualDirectoryType "PublicFolders" -ExternalAuthenticationMethods Fba
New-WebServicesVirtualDirectory -WebsiteName "XXXXXXX" -InternalUrl "https://INTERNAL_FQDN_OF_EXCHANGE/EWS/Exchange.asmx" -basicauthentication 1 -windowsauthentication 1
New-ActiveSyncVirtualDirectory -WebsiteName "XXXXXXX" -InternalUrl "https://INTERNAL_FQDN_OF_EXCHANGE/Microsoft-Server-ActiveSync" -ExternalAuthenticationMethods Basic -InternalAuthenticationMethods Basic
New-OabVirtualDirectory -WebsiteName "XXXXXXX" -InternalUrl "https://INTERNAL_FQDN_OF_EXCHANGE/OAB"
Set-OabVirtualDirectory -PollInterval "30" -Identity "oab (XXXXXXX)"
New-UMVirtualDirectory -WebsiteName "XXXXXXX"-InternalUrl "https://INTERNAL_FQDN_OF_EXCHANGE/UnifiedMessaging/Service.asmx"
New-AutodiscoverVirtualDirectory -WebsiteName "XXXXXXX" -InternalUrl "https://INTERNAL_FQDN_OF_EXCHANGE/Autodiscover/Autodiscover.xml" -BasicAuthentication 1 -WindowsAuthentication 1
Set-ClientAccessServer -Identity "Servername" -AutoDiscoverServiceInternalUri "https://INTERNAL_FQDN_OF_EXCHANGE/Autodiscover/Autodiscover.xml"
Set-OfflineAddressBook "Default Offline Address Book" -VirtualDirectories "Servername\OAB (XXXXXXX)" -Versions Version2,Version3,Version4)"
```

To check if we were successful in creating the virtual directories correctly type in the commands:

```powershell
Get-AutodiscoverVirtualDirectory
Get-OABVirtualDirectory
Get-OWAVirtualDirectory
Get-WebServicesVirtualDirectory
Get-ActiveSyncVirtualDirectory
Get-UMVirtualDirectory
```

For example, you should receive the following for `Get-OWAVirtualDirectory`

Name Server OwaVersion
&#8212;&#8212;&#8211; &#8212;&#8212;- &#8212;&#8212;&#8212;&#8211;

Owa (XXXXXXX) Server Name Exchange2007
Exadmin (XXXXXXX) Server Name Exchange2003or2000
Public (XXXXXXX) Server Name Exchange2003or2000
Exchweb (XXXXXXX) Server Name Exchange2003or2000
Exchange(XXXXXXX) Server Name Exchange2003or2000

Then run the following commands to disable the Kernel Mode Authentication on EWS, Autodiscover, and OAB virtual directories:

```cmd
cd $env:windir\system32\inetsrv
.\appcmd.exe unlock config "-section:system.webserver/security/authentication/windowsauthentication"
.\appcmd.exe set config "XXXXXXX/ews" "-section:windowsAuthentication" "-useKernelMode:False" /commit:apphost
.\appcmd.exe set config "XXXXXXX/AutoDiscover" "-section:windowsAuthentication" "-useKernelMode:False" /commit:apphost
.\appcmd.exe set config "XXXXXXX/oab" "-section:windowsAuthentication" "-useKernelMode:False" /commit:apphost
```

Run: `iisreset /noforce`


You must rerun the Internet Address Management Wizard to stamp the new virtual directories with the proper external URL and maybe you have to check the certificates.

======================================
Troubleshooting for useKernelMode

```cmd
%windir%\system32\inetsrv\appcmd.exe set config /section:system.webServer/security/authentication/windowsAuthentication /useKernelMode:false
```

With the following command you should see something like this:

```cmd
%windir%\system32\inetsrv\appcmd.exe list config /section:system.webServer/security/authentication/windowsAuthentication
```
