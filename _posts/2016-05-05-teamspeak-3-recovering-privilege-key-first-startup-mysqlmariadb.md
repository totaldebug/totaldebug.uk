---
title: 'Teamspeak 3 Recovering privilege key after first startup (MySQL/MariaDB Only)'
date: 2016-05-05
categories: [Linux, Teamspeak]
tags: [ts3, mysql, mariadb, teamspeak, recover, privilege]
---
When deploying a Teamspeak3 server one thing that is vital for the first time startup is to make a note of the privilege key, but what do you do if for some reason you didn't write it down?

In this article I will show you how to retrieve it!
<!--more-->

  1. Login to your Teamspeak3 server
  2. Connect to SQL:

  ```mysql
  mysql -uyouruser -p
  ```

  3. Select your TS3 Database:

  ```mysql
  USE <DatabaseName>;
  ```
  4. Sleect the Tokens Table:

  ```mysql
  SELECT * FROM tokens;
  ```
  5. You should see a privilege key copy this (token_key) column

Its as simple as that! the privilege key can only be used once, when it has been used it will be removed from the tokens table.
