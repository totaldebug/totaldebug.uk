---
title: Folder redirection permissions. My Documents / Start Menu / Desktop
date: 2012-07-30
categories: [Microsoft, Windows]
tags: [windows, redirect, documents, start]
---
How to correctly set-up folder redirection permissions for My Documents, Start Menu and Desktop. I have worked on many company computer systems where this hadn&#8217;t been done correctly resulting in full access to all files and folders, as an outsider I had access to other peoples my documents from my laptop without being on the domain! Following this article will stop that happening to your data.
<!--more-->

**When creating the redirection share, limit access to the share to only users that need access.**
<!--more-->

Because redirected folders contain personal information, such as documents and EFS certificates care should be taken to protect them as well as possible. In general:

  * Restrict the share to only users that need access. Create a security group for users that have redirected folders on a particular share, and limit access to only those users.
  * When creating the share, hide the share by putting a $ after the share name. This will hide the share from casual browsers; the share will not be visible in My Network Places.
  * Only give users the minimum amount of permissions needed. The permissions needed are shown in the tables below:

**Table 12 NTFS Permissions for Folder Redirection Root Folder**

<table>
  <tr>
    <th colspan="1">
      User Account
    </th>

    <th colspan="1">
      Minimum permissions required
    </th>
  </tr>

  <tr>
    <td colspan="1">
      Creator/Owner
    </td>

    <td colspan="1">
      Full Control, Subfolders And Files Only
    </td>
  </tr>

  <tr>
    <td colspan="1">
      Administrator
    </td>

    <td colspan="1">
      None
    </td>
  </tr>

  <tr>
    <td colspan="1">
      Security group of users needing to put data on share.
    </td>

    <td colspan="1">
      List Folder/Read Data, Create Folders/Append Data &#8211; This Folder Only
    </td>
  </tr>

  <tr>
    <td colspan="1">
      Everyone
    </td>

    <td colspan="1">
      No Permissions
    </td>
  </tr>

  <tr>
    <td colspan="1">
      Local System
    </td>

    <td colspan="1">
      Full Control, This Folder, Subfolders And Files
    </td>
  </tr>
</table>

**Table 13 Share level (SMB) Permissions for Folder Redirection Share**

<table>
  <tr>
    <th colspan="1">
      User Account
    </th>

    <th colspan="1">
      Default Permissions
    </th>

    <th colspan="1">
      Minimum permissions required
    </th>
  </tr>

  <tr>
    <td colspan="1">
      Everyone
    </td>

    <td colspan="1">
      Full Control
    </td>

    <td colspan="1">
      No Permissions
    </td>
  </tr>

  <tr>
    <td colspan="1">
      Security group of users needing to put data on share.
    </td>

    <td colspan="1">
      N/A
    </td>

    <td colspan="1">
      Full Control,
    </td>
  </tr>
</table>

**Table 14 NTFS Permissions for Each Users Redirected Folder**

<table>
  <tr>
    <th colspan="1">
      User Account
    </th>

    <th colspan="1">
      Default Permissions
    </th>

    <th colspan="1">
      Minimum permissions required
    </th>
  </tr>

  <tr>
    <td colspan="1">
      %Username%
    </td>

    <td colspan="1">
      Full Control, Owner Of Folder
    </td>

    <td colspan="1">
      Full Control, Owner Of Folder
    </td>
  </tr>

  <tr>
    <td colspan="1">
      Local System
    </td>

    <td colspan="1">
      Full Control
    </td>

    <td colspan="1">
      Full Control
    </td>
  </tr>

  <tr>
    <td colspan="1">
      Administrators
    </td>

    <td colspan="1">
      No Permissions
    </td>

    <td colspan="1">
      No Permissions
    </td>
  </tr>

  <tr>
    <td colspan="1">
      Everyone
    </td>

    <td colspan="1">
      No Permissions
    </td>

    <td colspan="1">
      No Permissions
    </td>
  </tr>
</table>

**Always use the NTFS Filesystem for volumes holding users data.**

For the most secure configuration, configure servers hosting redirected files to use the NTFS File System. Unlike FAT, NTFS supports Discretionary access control lists (DACLs) and system access control lists (SACLs), which control who can perform operations on a file and what events will trigger logging of actions performed on a file.

**Let the system create folders for each user.**

To ensure that Folder Redirection works optimally, create only the root share on the server, and let the system create the folders for each user. Folder Redirection will create a folder for the user with appropriate security.

If you must create folders for the users, ensure that you have the correct permissions set, also note that if pre-creating folders you must clear the &#8220;grant the user exclusive rights to XXX checkbox on the settings tab of the Folder Redirection page. If you don&#8217;t clear this checkbox, then Folder Redirection will first check a pre-existing folder to ensure the user is the owner. If the folder is pre-created by the administrator, this check will fail and redirection will be aborted. Folder Redirection will then log an event in the Application event log:

Error: Folder Redirection

Event ID: 101

Event Message:

Failed to perform redirection of folder XXXX. The new directories for the redirected folder could not be created. The folder is configured to be redirected to \\server\share, the final expanded path was \\server\share\XXX .

The following error occurred:

This security ID may not be assigned as the owner of this object.

It is strongly recommended that you do not pre-create folders, and allow Folder Redirection to create the folder for the user.

**Ensure correct permissions are set if redirecting to a users home directory.**

Windows Server 2003 and Windows XP allow you to redirect a users My Documents folder to their home directory. When redirecting to the home directory, the default security checks are not made &#8211; ownership and the existing directory security are not checked and any existing permissions are not changed &#8211; it is assumed that the permissions on the users home directory are set appropriately.

If you are redirecting to a users home directory, be sure that the permissions on the users home directory are set appropriately for your organization.
