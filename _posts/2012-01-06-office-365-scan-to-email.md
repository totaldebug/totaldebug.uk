---
id: 105
title: Office 365 Scan to Email
date: 2012-01-06T09:41:26+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=105
permalink: /office-365-scan-to-email/
voted_IP:
  - 'a:1:{s:13:"194.83.245.53";i:1404377758;}'
post_views_count:
  - "3039"
  - "3039"
votes_count:
  - "1"
categories:
  - Office 365
---
Ok so this one had me stumped for a LONG time trying to figure out how to get scanners to authenticate to office 365 in the end i found out that the scanner i was using wasnt supported in this format so i found this work around hope it helps you!  
<!--more-->

You basically need to create an smtp relay on a local server / computer to forward your scans to then set the smtp relay up as below which will then do the authentication part for you.

&nbsp;

#### SMTP relay settings for Office 365 {#tocHeadRef}

To configure an SMTP relay in Office 365, you need the following:

  * A user who has an Exchange Online mailbox
  * The SMTP set to port 587
  * Transport Layer Security (TLS) encryption enabled
  * The mailbox server name

To obtain SMTP settings information, follow these steps:

  1. Sign in to Outlook Web App.
  2. Click **Options**, and then click **See All Options**.
  3. Click Account, click **My Account**, and then in the **Account Information** area, click **Settings for POP, IMAP, and SMTP access**.Note the SMTP settings information that is displayed on this page.

#### Configure Internet Information Services (IIS) {#tocHeadRef}

To configure Internet Information Services (IIS) so that your LOB programs can use the SMTP relay, follow these steps:

  1. Create a user who has an Exchange Online mailbox. To do this, use one of the following methods: 
      * Create the user in Active Directory Domain Services, run directory synchronization, and then activate the user by using an Exchange Online license.**Note **The user must not have an on-premises mailbox.
      * Create the user by using the Office 365 portal or by using Microsoft Online Services PowerShell Module, and then assign the user an Exchange Online license.
  2. Configure the IIS SMTP relay server. To do this, follow these steps: 
    <li type="a">
      Install IIS on an internal server. During the installation, select the option to install the SMTP components.
    </li>
    <li type="a">
      In Internet Information Services (IIS) Manager, expand the Default SMTP Virtual Server, and then click <strong>Domains</strong>.
    </li>
    <li type="a">
      Right-click <strong>Domains</strong>, click <strong>New</strong>, click <strong>Domain</strong>, and then click <strong>Remote</strong>.
    </li>
    <li type="a">
      In the <strong>Name</strong> box, type <strong>*.com</strong>, and then click <strong>Finish</strong>.
    </li>
  3. Double-click the domain that you just created.
  4. Click to select the **Allow incoming mail to be relayed to this domain **check box.
  5. In the **Route domain** area, click **Forward all mail to smart host**, and then in the box, type the mailbox server name.
  6. Click** Outbound Security**, and then configure the following settings: 
    <li type="a">
      Click <strong>Basic Authentication</strong>.
    </li>
    <li type="a">
      In the <strong>User name</strong> box, type the user name of the Office 365 mailbox user.
    </li>
    <li type="a">
      In the <strong>Password</strong> box, type the password of the Office 365 mailbox user.
    </li>
    <li type="a">
      Click to select the <strong>TLS encryption </strong>check box, and then click <strong>OK</strong>.
    </li>
  7. Right-click the Default SMTP Virtual Server node, and then click **Properties**.
  8. On the **Delivery **tab, click **Outbound Connections**.
  9. In the **TCP Port **box, type 587, and then click **OK**.
 10. Click **Outbound Security**, and then configure the following settings: 
    <li type="a">
      Click <strong>Basic Authentication</strong>.
    </li>
    <li type="a">
      In the <strong>User name</strong> box, type the user name of the Office 365 mailbox user.
    </li>
    <li type="a">
      In the <strong>Password</strong> box, type the password of the Office 365 mailbox user.
    </li>
    <li type="a">
      Click to select the <strong>TLS encryption </strong>check box, and then click <strong>OK</strong>.
    </li>
 11. On the **Access **tab, click **Authentication**, click to select the **Anonymous access** check box, and then click **OK**.
 12. On the **Relay **tab, select **Only the list below**, type the IP addresses of the client computers that will be sending the email messages, and then click **OK**.