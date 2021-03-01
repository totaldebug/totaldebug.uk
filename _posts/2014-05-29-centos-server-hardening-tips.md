---
title: CentOS Server Hardening Tips
date: 2014-05-29
layout: post
---
This article provides various hardening tips for your Linux server.
<!--more-->

#### 1. Minimise Packages to Minimise Vulnerability

Do you really want all sorts of services installed?. It’s recommended to avoid installing packages that are not required to avoid vulnerabilities. This may minimise risks that compromise other services on your server. Find and remove or disable unwanted services from the server to minimize vulnerability. Use the **chkconfig** command to find out services which are running on **runlevel 3**.

```sh
/sbin/chkconfig --list |grep '3:on'
```

Once you&#8217;ve found any unwanted services that are running, disable them using the following command:

```sh
chkconfig serviceName off
```

Use the RPM package managers such as &#8220;yum&#8221; or &#8220;apt-get&#8221; tools to list all installed packages on a system and remove them using the following command:

```sh
yum -y remove package-name
```

```sh
sudo apt-get remove package-name
```

#### 2. Check Listening Network Ports

With the help of the **netstat** networking command you can view all open ports and associated programs. As I said above use the **chkconfig** command to disable all unwanted network services on the system.

```sh
netstat -tulpn
```

#### 3. Use Secure Shell(SSH)

**Telnet** and **rlogin** protocols use plain text, a non encrypted format which is prone to security breaches. SSH is a secure protocol that uses encryption technologies during communication.

Never login directly as **root** unless necessary. Use **sudo** to execute commands. sudo users are specified in the `/etc/sudoers` file which can be edited with the **visudo** utility which opens in the VI editor.

It’s also recommended to change default SSH (22) port number with a different unassigned port number. Open the main SSH configuration file and change the following parameters to restrict users to access. (`vi /etc/ssh/sshd_config`)

##### Disable root Login

This will disable users from logging in over SSH with the Root account, Obviously if you don&#8217;t have console access don&#8217;t change this setting.

```sh
PermitRootLogin n
```

##### Only Allow Specific Users

Change this to only allow users that you want to be using SSH Access (one line per user)

```sh
AllowUsers username
AllowUsers username
```

##### Use SSH Protocol 2 Version

This should be used in all cases!

```shell
Protocol 2
```

#### 4. Keep Your System updated

Always keep your system updated with latest releases, patches, security fixes and kernel updates when available.

```sh
yum updates
yum check-update
```

#### 5. Lockdown Cronjobs

**Cron** has a built in feature, where it allows you to specify who can and can not run cron jobs. This is controlled by the use of the following files called `/etc/cron.allow` and `/etc/cron.deny`. To stop a user using cron, simply add their user names to `cron.deny` and to allow a user to run cron add them to `cron.allow`. If you would like to disable all users from using cron, add the **ALL** line to `cron.deny` file.

```sh
echo username >>/etc/cron.allow
echo ALL >>/etc/cron.deny
```

#### 6. Remove KDE/GNOME Desktops

There is no need to run X Window desktops like KDE or GNOME on your LAMP server. You can remove or disable them to increase security and performance. To disable simple open the file `/etc/inittab` and set the run level to 3. If you wish to remove it completely from the system use the below command.

```sh
yum groupremove "X Window System"
```

#### 7. Turn Off IPv6

If you’re not using a IPv6 protocol, then you should disable it. Most of the applications or policies don&#8217;t required IPv6 protocol and currently it isn&#8217;t required on the server. Go to the network configuration file and add followings lines to disable it.(`vi /etc/sysconfig/network`)

```sh
NETWORKING_IPV6=no
IPV6INIT=no
```

#### 8. Restrict Users from using Old Passwords

This is very useful if you want to stop users using the same old passwords. The old password file is located at `/etc/security/opasswd`. This can be achieved by using the PAM module.
`vi /etc/pam.d/system-auth`

Add the following line to the **auth** section

```sh
auth        sufficient    pam_unix.so likeauth nullok
```

Add the following line to **password** section to disallow a user from re-using the last 5 password.

```sh
password   sufficient    pam_unix.so nullok use_authtok md5 shadow remember=5
```

Only the last **5** passwords are remembered by the server, if you try to use any of the last **5** old passwords you will receive an error.

#### 9. Enforce Stronger Passwords

A number of users use soft or weak passwords and their password might be hacked with a dictionary based or brute-force attack. The `pam_cracklib` module is available in the PAM (Pluggable Authentication Modules) module stack which will force a user to set a strong passwords. Add the following to this file (`vi /etc/pam.d/system-auth`)

```sh
/lib/security/$ISA/pam_cracklib.so retry=3 minlen=8 lcredit=-1 ucredit=-2 dcredit=-2 ocredit=-1
```

#### 10. Enable Iptables (Firewall)

It’s highly recommended to enable the Linux firewall to secure access to your servers. Apply rules in iptables to filter incoming, outgoing and forwarding packets. We can specify the source and destination address to allow and deny specific udp/tcp port number.

The following are rules i would highly recommend adding to yours (`vi /etc/sysconfig/iptables`) the first block of rules drop connections that are not recognised, the second allows local network access to certain ports e.g. SSH port 22.

```sh
Generated by iptables-save v1.4.7 on Mon Mar 31 14:07:57 2014
*filter
:INPUT DROP [0:0]
:FORWARD DROP [0:0]
:OUTPUT ACCEPT [7:747]
-A INPUT -i lo -j ACCEPT
-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
-A INPUT -p tcp -m tcp --tcp-flags FIN,SYN,RST,PSH,ACK,URG NONE -j DROP
-A INPUT -p tcp -m tcp ! --tcp-flags FIN,SYN,RST,ACK SYN -m state --state NEW -j DROP
-A INPUT -p tcp -m tcp --tcp-flags FIN,SYN,RST,PSH,ACK,URG FIN,SYN,RST,PSH,ACK,URG -j DROP
-A INPUT -f -j DROP

-A INPUT -s 192.168.0.0/24 -p icmp --icmp-type any -j ACCEPT
-A INPUT -s 192.168.0.0/24 -i eth0 -p tcp -m tcp --dport 22 -j ACCEPT
```

#### 11. Keep /boot as read-only

The Linux kernel and its related files are in `/boot` directory which is by default read-write. Changing it to read-only reduces the risk of unauthorised modification of critical boot files. To do this, `vi /etc/fstab` and add the following to the bottom.

```sh
LABEL=/boot     /boot     ext2     defaults,ro     1 2
```

Please note that you need to reset the change to read-write if you need to upgrade the kernel in future.

#### 12. Setup NTP

Having an accurate system clock is important for reviewing log files and determining when an event occurred. Often system clocks can become out of sync or be reset to an older date and this can cause havoc with tracking of errors. Consider creating a Cron job rather than running ntpd to update the time daily or hourly with a common source for all servers.

#### 13. Install DDoS Deflate

DDoS Deflate is a lightweight bash shell script designed to assist in the process of blocking a denial of service attack. It uses the command below to create a list of IP addresses connected to the server, along with their total number of connections.

```sh
netstat -ntu | awk ‘{print $5}’ | cut -d: -f1 | sort | uniq -c | sort -n
```

##### Features of (D)DoS Deflate

Configuration file: /usr/local/ddos/ddos.conf
To whitelist IP address, use /usr/local/ddos/ignore.ip.list.
It is having a feature to unblock IP addresses automatically after a preconfigured time limit.
You can execute the script at a chosen frequency.
You will get email alerts when IP addresses are blocked.

##### Installation

```sh
wget http://www.inetbase.com/scripts/ddos/install.sh
chmod 0700 install.sh
./install.sh
```

##### Uninstallation

```sh
wget http://www.inetbase.com/scripts/ddos/uninstall.ddos
chmod 0700 uninstall.ddos
./uninstall.ddos
```

##### Script to check No of connected ip’s.

```sh
sh /usr/local/ddos/ddos.sh
```

##### Restart DDos Deflate

```sh
sh /usr/local/ddos/ddos.sh -c
```

#### 14. Install DenyHosts

DenyHosts is a security tool written in python that monitors server access logs to prevent brute force attacks on a virtual server. The program works by banning IP addresses that exceed a certain number of failed login attempts.

* * *

This list is still not completed, I am constantly adding new security tips to it, should you have any you think I should include please comment below and I will add them.
