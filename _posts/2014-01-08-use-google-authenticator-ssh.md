---
id: 203
title: Use Google Authenticator for SSH
date: 2014-01-08T13:33:05+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=203
permalink: /use-google-authenticator-ssh/
post_views_count:
  - "3220"
categories:
  - CentOS
tags:
  - android
  - authenticator
  - blackberry
  - google
  - iphone
  - pam
  - qrcode
  - scratch
  - security
  - ssh
---
I have recently setup two factor authentication on my server using Google Authenticator, I thought it would be a good idea to share with you guys the way I achieved this and some issues I bumped into along the way.  
<!--more-->

## Install NTP to synchronize the system clock (Very important or nothing will work)

Login via ssh as root user.  
Type the following command to install ntp:

<pre class="lang:default decode:true">yum install ntp
chkconfig ntpd on
ntpdate pool.ntp.org
/etc/init.d/ntpd start</pre>

## Install make and disable SELinux

Install Make:

<pre class="lang:default decode:true">yum install -y make</pre>

Open SE Linux Config for editing:

<pre class="lang:default decode:true">vi /etc/sysconfig/selinux</pre>

Change:

<pre class="lang:default decode:true">SELINUX=enforcing</pre>

To:

<pre class="lang:default decode:true">SELINUX=permissive</pre>

save the file and then reboot the server.

## Install and setup the Google-Authentication PAM module on your server

Make sure that you have the “<a title="Link EPEL" href="https://fedoraproject.org/wiki/EPEL" target="_blank">link EPEL</a>” repo installed so that you will be able to install everything. I normally install it and then disable it, and only –enablerepo when it is needed.

##### On CentOS 5.x

If you don’t yet have Python 2.6 installed install it: – this will install in in parallel with python2.4 so as not to break yum:

<pre class="lang:default decode:true">yum --enablerepo=epel install python26</pre>

once installed lets install some dependencies – I have added a couple just in case I need them:

<pre class="lang:default decode:true">yum --enablerepo=epel install gcc gcc++ pam-devel subversion python26-devel</pre>

##### On Centos 6.x

You will already have Python 2.6 running so you wont need to install that – lets just install some dependencies in case we need them:

<pre class="lang:default decode:true">yum --enablerepo=epel install gcc gcc++ pam-devel subversion python-devel</pre>

##### Now we need to download and install git

<pre class="lang:default decode:true " >yum --enablerepo=epel install git</pre>

Make a directory for the authenticator and go into it:

<pre class="lang:default decode:true " >mkdir ./google-authenticator
cd google-authenticator/</pre>

Download the SVN for google authenticator:

<pre class="lang:default decode:true " >git clone https://code.google.com/p/google-authenticator/</pre>

Change to to downloaded directory (on mine I also had to cd into libpam)

<pre class="lang:default decode:true " >cd google-authenticator/libpam/</pre>

Run make and make install:

<pre class="lang:default decode:true " >make && make install</pre>

If all goes well you should now have the Google-Authentication PAM module on your server, if not then please leave a comment and I will help as best I can 🙂 

## Setup PAM authentication on the SSH server to work with the Google-Authentication PAM module

Now we need to configure Pam auth for SSH:

<pre class="lang:default decode:true " >vi /etc/pam.d/sshd</pre>

change the file to this – basically adding the “auth required pam\_google\_authenticator.so” line:

<pre class="lang:default decode:true " >#%PAM-1.0
auth required pam_google_authenticator.so
auth include system-auth
account required pam_nologin.so
account include system-auth
password include system-auth
session optional pam_keyinit.so force revoke
session include system-auth
session required pam_loginuid.so</pre>

##### Skip two-factor authentication if logging in from the local network

At first this is all very cool, but soon it becomes a bit annoying, too. When I SSH from a local network, I just don’t want to enter the verification code because I trust my local network. When I SSH from remote, a verification code is required. One way to arrange that, is always login with certificates. But there is another way to configure it: using the pam_access module. Try this config:

<pre class="lang:default decode:true " >auth [success=1 default=ignore] pam_access.so accessfile=/etc/security/access-local.conf
auth required pam_google_authenticator.so nullok</pre>

The config file, /etc/security/access-local.conf looks like:

<pre class="lang:default decode:true " ># Two-factor can be skipped on local network
+ : ALL : 10.0.0.0/24
+ : ALL : LOCAL
- : ALL : ALL</pre>

Local login attempts from 10.0.0.0/24 will not require two-factor authentication, while all others do.  
Now we need to edit the ssh daemon configuration file.

<pre class="lang:default decode:true " >vi /etc/ssh/sshd_config</pre>

Uncomment:

<pre class="lang:default decode:true " >ChallengeResponseAuthentication yes</pre>

Comment out:

<pre class="lang:default decode:true " >#ChallengeResponseAuthentication no</pre>

Make sure that:

<pre class="lang:default decode:true " >UsePAM yes</pre>

To make your system truly secure – you might want to disable PubkeyAuthentication:

<pre class="lang:default decode:true " >PubkeyAuthentication no</pre>

****NOW STOP and make sure that second SSH session is working because you can then edit /etc/ssh/sshd_config & /etc/pam.d/sshd if something goes wrong. Otherwise you are going to need to make these changes on the local console**

Restart the SSH daemon:

<pre class="lang:default decode:true " >service sshd restart</pre>

Then run the google authenticator on the server by running:

<pre class="lang:default decode:true " >google-authenticator</pre>

You should see something like:

<pre class="lang:default decode:true " >https://www.google.com/chart?chs=200x200&chld=M%7C0&cht=qr&chl=otpauth://totp/user@server%3Fsecret%3DSAEP64T5VZAVWAFB
Your new secret key is: SAEP64T5VZAVWAFB
Your verification code is 376046
Your emergency scratch codes are:
67868696
26247332
54815527
54336661</pre>

Answer each of the question to best suit your needs – I said Yes to everything except the “you can increase the window from its default size of 1:30min to about 4min.

**Note: The emergency scratch codes are one-time use verification codes in the event your phone is unavailable. So save these somewhere save!**

In your browser, load the URL noted above; it will show a QRCode that you can scan into your phone using the Google Authenticator application for Android, iPhone or Blackberry. If you already have a Google Authenticator token being generated on your phone, you can add a new one and it will display them both.

  * Start the app on your phone:
  * choose to add by scanning the barcode and then using the url from above in your browser scan the barcode.

If all is working you should be able to SSH in with the username, then authentication code from your phone/device and then your password.