---
title: Send on Behalf and Send As
date: 2011-07-27 10:20:00 +0100
layout: post
categories: [Microsoft, Exchange]
tags: [send, behalf, exchange, outlook]
---
Send on Behalf and Send As are similar in fashion. Send on Behalf will allow a user to send as another user while showing the recipient that it was sent from a specific user on behalf of another user. What this means, is that the recipient is cognitive of who actually initiated the sending message, regardless of who it was sent on behalf of. This may not be what you are looking to accomplish. In many cases, you may want to send as another person and you do not want the recipient to be cognitive about who initiated the message. Of course, a possible downside to this, is that if the recipient replies, it may go to a user who did not initiate the sent message and might be confused depending on the circumstances. Send As can be useful in a scenario where you are sending as a mail-enabled distribution group. If someone replies, it will go to that distribution group which ultimately gets sent to every user who is a part of that distribution group. This article will explains how to use both methods.

## Send on Behalf

There are three ways to configure Send on Behalf. The first method is by using Outlook Delegates which allows a user to grant another user to Send on Behalf of their mailbox. The second method is having an Exchange Administrator go into the Exchange Management Shell (EMS) and grant a specific user to Send on Behalf of another user. The third and final method is using the Exchange Management Console (EMC).

### Outlook Delegates

There are major steps in order to use Outlook Delegates. The first is to select the user and add him as a delegate. You then must share your mailbox to that user.

  1. Go to **Tools **and choose **Options**
  2. Go to the **Delegates Tab** and click **Add**
  3. Select the user who wish to grant access to and click **Add **and then **Ok**

> There are more options you can choose from once you select OK after adding that user. Nothing in the next window is necessary to grant send on behalf.
{: .prompt-info }

  1. When back at the main Outlook window, in the Folder List, choose your mailbox at the root level. This will appear as **Mailbox – Full Name**
  2. Right-click and choose **Change Sharing Permissions**
  3. Click the** Add **button
  4. Select the user who wish to grant access to and click **Add** and then **Ok**
  5. In the permissions section, you must grant the user at minimum, Non-editing Author.

### Exchange Management Shell (EMS)

This is a fairly simple process to complete. It consists of running only the following command and you are finished. The command is as follows:

**Set-Mailbox UserMailbox -GrantSendOnBehalfTo UserWhoSends**

### Exchange Management Console (EMC)

  1. Go to **Recipient Management **and choose **Mailbox**
  2. Choose the mailbox and choose **Properties** in Action Pane
  3. Go to the **Mail Flow Settings Tab** and choose **Delivery Options**
  4. Click the **Add** button
  5. Select the user who wish to grant access to and click **Add** and then **Ok**


## Send As

As of Exchange 2007 SP1, there are two ways to configure SendAs. The first method is having an Exchange Administrator go into the Exchange Management Shell (EMS) and grant a specific user to SendAs of another user. The second and final method (added in SP1) is using the Exchange Management Console (EMC).

### Exchange Management Shell (EMS)

The first method is to grant a specific user the ability to SendAs as another user. It consists of running only the following command and you are finished. The command is as follows:

    ```powershell
    Add-ADPermission UserMailbox -ExtendedRights Send-As -user UserWhoSends
    ```

### Exchange Management Console (EMC)

1. Go to **Recipient Management** and choose **Mailbox**
2. Choose the mailbox and choose **Manage Send As Permissions** in Action Pane
3. Select the user who wish to grant access to and click **Add** and then **Ok**

## Miscellaneous Information

### No “From:” Button

In order for a user to Send on Behalf or Send As another user, their Outlook profile must be configured to show a From: button. By default, Outlook does not show the From: button. In order to configure a user’s Outlook profile to show the From: button:

### Replies

If you are sending as another user, the recipient user might reply. By default, Outlook is configured to set the reply address to whoever is configured as the sending address. So if I am user A sending on behalf of user B, the reply address will be set to user B. If you are the user initiating the sending message, you can configure your Outlook profile to manually configure the reply address.

### Conflicting Methods

If you are configuring Send on Behalf permissions on the Exchange Server, ensure that the user is not trying to use the Outlook delegates at the same time. Recently, at a client, I was given the task to configure Send As as well as Send on Behalf. As I was configuring Send As on the server, I found out that the client was attempting to use Outlook Delegates at the same time. Send As would not work. Once the user removed the user from Outlook Delegates and removed permissions for that user at the root level of your mailbox that appears as Mailbox – Full Name, Send As began to work. So keep in mind, if you are configuring Send As or Send on Behalf, use only one method for a specific user.

### SendAs Disappearing

If you are in a Protected Group, something in Active Directory called SDProp will come by every hour and remove SendAs permissions on users in these protected groups.  What security rights are configured on these security accounts are determined based on what security rights are assigned on the adminSDHolder object which exists in each domain.  The important part for you to remember is that every hour, inheritance on these protected groups will be removed and SendAs will be wiped away.

A good blog article explaining what adminSDHolder and SDprop are and what Protected Groups  is located [here](http://theessentialexchange.com/blogs/michael/archive/2008/10/22/admincount-adminsdholder-sdprop-and-you.aspx).
