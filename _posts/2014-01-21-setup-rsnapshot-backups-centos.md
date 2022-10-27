---
title: Setup rSnapshot backups on CentOS
date: 2014-01-21
categories: [Linux, Backups]
tags: [rsnapshot, rsync, centos, backups, configuration]
---
In this article I will be talking you through how to use rSnapshot and rSync to backup your server with an email alert when the backup has been completed and what has been backed up.
<!--more-->

1. You must first have rSync and rSnapshot installed:

```shell
yum -y install rsync rsnapshot
```

2. Once installed you will then need to create the correct configuration files for your server. Here is an example of what I use (save as backup_config.conf):

```shell
config_version  1.2
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
retain  daily   14
```


> It is important to use tabs between each argument otherwise you will receive errors.
{: .prompt-warning }

3. Now we need to create an exclude file, this will exclude any directories that you don&#8217;t want to backup. This needs to be placed in the location specified on you conf file above(save as backup_config.exclude):

```shell
+ /var
+ /var/www
- /var/*
+ /home
- /*
```

> When adding a sub directory e.g. `+ /var/www` you must first include `+ /var` and then your sub directory, you can then exclude the existing directories as I have in my example. (you don't need to use tab in this file)
{: .prompt-tip }

4. Create the directory for backups and logs to be stored:

```shell
mkdir -p /data/backups/snapshots/server/
mkdir -p /var/log/rsnapshot/
```

5. Test the backup by running:

```shell
/usr/bin/rsnapshot -c /etc/rsnapshot/mp-vps01.conf
```

If successful move on if not troubleshoot, ask below if you get stuck.

6. Schedule the backup with crontab:

```shell
crontab -e
0 0 * * * /usr/bin/rsnapshot -c /etc/rsnapshot/mp-vps01.conf daily
```

If you would like email alerts use the following:

```shell
0 0 * * * /usr/bin/rsnapshot -c /etc/rsnapshot/mp-vps01.conf daily | mail -s "My Backup Job" your@email.co.uk
```

> If the backup fails the email will be empty, I still haven't figured out how to resolve this to email the errors, If you know please let me know in the comments!
{: .prompt-info }
