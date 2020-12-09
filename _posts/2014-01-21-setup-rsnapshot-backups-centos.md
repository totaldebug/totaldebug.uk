---
id: 214
title: Setup rSnapshot backups on CentOS
date: 2014-01-21T10:38:42+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=214
permalink: /setup-rsnapshot-backups-centos/
post_views_count:
  - "1007"
slide_template:
  - default
audio_mp3:
  - ""
audio_ogg:
  - ""
audio_embed:
  - ""
video_mp4:
  - ""
video_ogv:
  - ""
video_webm:
  - ""
video_embed:
  - ""
video_poster:
  - ""
link_url:
  - ""
status_author:
  - ""
quote_author:
  - ""
featured_media:
  - 'true'
image: https://spottedhyena.co.uk/wp-content/uploads/2014/01/rsnapshot.jpg
categories:
  - CentOS
tags:
  - backup
  - config
  - configuration
  - cron
  - exclude
  - rsnapshot
  - rsync
---
In this article I will be talking you through how to use rSnapshot and rSync to backup your server with an email alert when the backup has been completed and what has been backed up.  
<!--more-->

1. You must first have rSync and rSnapshot installed:

<pre class="lang:default decode:true ">yum -y install rsync rsnapshot</pre>

2. Once installed you will then need to create the correct configuration files for your server. Here is an example of what I use (save as backup_config.conf):

<pre class="lang:default decode:true ">config_version  1.2
snapshot_root   /data/backups/snapshots/server/
cmd_cp  /bin/cp
cmd_rm  /bin/rm
cmd_rsync       /usr/bin/rsync
cmd_ssh /usr/bin/ssh
cmd_logger      /usr/bin/logger
#cmd_du /usr/bin/du
interval        daily   7
interval        weekly  4
interval        monthly 3
verbose 3
loglevel        4
logfile /var/log/rsnapshot/backups.log
exclude_file    /etc/rsnapshot/backup_config.exclude
rsync_long_args --delete        --numeric-ids   --delete-excluded       --stats
lockfile        /var/run/rsnapshot.pid
backup  root@spitfiredev.com:/  mp-vps01
rsync_long_args --stats --delete        --numeric-ids   --delete-excluded
retain  daily   14</pre>

**NOTE:** It is important to use tabs between each argument otherwise you will receive errors.

3. Now we need to create an exclude file, this will exclude any directories that you don&#8217;t want to backup. This needs to be placed in the location specified on you conf file above(save as backup_config.exclude):

<pre class="lang:default decode:true ">+ /var
+ /var/www
- /var/*
+ /home
- /*
</pre>

**NOTE:** when adding a sub directory e.g. + /var/www you must first include + /var and then your sub directory, you can then exclude the existing directories as I have in my example. (you dont need to use tab in this file)

4. Create the directory for backups and logs to be stored:

<pre class="lang:default decode:true ">mkdir -p /data/backups/snapshots/server/
mkdir -p /var/log/rsnapshot/</pre>

5. Test the backup by running:

<pre class="lang:default decode:true ">/usr/bin/rsnapshot -c /etc/rsnapshot/mp-vps01.conf</pre>

If successful move on if not troubleshoot, ask below if you get stuck.

6. Schedule the backup with crontab:

<pre class="lang:default decode:true ">crontab -e
0 0 * * * /usr/bin/rsnapshot -c /etc/rsnapshot/mp-vps01.conf daily</pre>

If you would like email alerts use the following:

<pre class="lang:default decode:true ">0 0 * * * /usr/bin/rsnapshot -c /etc/rsnapshot/mp-vps01.conf daily | mail -s "My Backup Job" your@email.co.uk
</pre>

**NOTE:** If the backup fails the email will be empty, I still haven&#8217;t figured out how to resolve this to email the errors, If you know please let me know in the comments!