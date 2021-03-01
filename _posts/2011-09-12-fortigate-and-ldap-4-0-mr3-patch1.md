---
title: Fortigate and LDAP 4.0 MR3 Patch1
date: 2011-09-12
layout: post
---
Hi Guys,

I have been setting up a lot of Fortigate&#8217;s recently and on my first few had issues with the settings for LDAP i found that it was tricky to remember the correct settings and also typing out the long LDAP Strings can be a bit tricky and cause typo&#8217;s.

  1. Logon to the fortigate and go to the Users -> Remote -> LDAP (Create New)
  2. Fill in a Name for the connector
  3. Fill in the IP Address of the server that has LDAP Installed
  4. Change the Common Name Identifier to: **sAMAccountName**
  5. Enter the Distinguished Name if your domain was domain.local the distinguished name would be: **DC=domain,DC=local**
  6. Make your Bind Type **Regular**
  7. In the User DN Box you must type the full path to the user e.g. if you user is domain.local/users/service accounts/fortigate you would need the following: **CN=fortigate,OU=Service Accounts,OU=Users,OU=MyBusiness,DC=domain,DC=local**
  8. type the password for your service account

This should be all that you require. one thing to keep an eye on is typo&#8217;s when doing the User DN this will stop you from being able to logon with an SSL-VPN or anything for that matter!

If you get an error in the logs for SSL-VPN saying no_matching_policy then you will have a typo somewhere.
