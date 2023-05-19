---
title: Use Google Authenticator for 2FA with SSH
date: 2014-01-08
categories: [Linux, Authentication]
tags: [hot-to, 2fa, linux, auth]
---

By default, SSH uses password authentication, most SSH hardening instructions recommend using SSH keys instead. However, SSH keys still only provide a single factor authentication, even though it is much more secure. But like someone can guess a password or get it from alternative sources, they can also steal your private SSH key and then access all data that key has access to.

In this guide, We will setup Two-Factor authentication (2FA) meaning that more than one factor is required to authenticate or log in. This means any hackers would need to compromise multiple devices, like your computer and your phone to get access.

## Prerequisites

To follow this tutorial, you will need:

* One CentOS 8 or Ubuntu server with a sudo non-root user and SSH key
* A phone or tablet with an OATH-TOTP app, like Authy or Google Authenticator

## Install chrony to synchronize the system clock

This step is very important, due to the way 2FA works, the time must be accurate on the server. Run the following commands to setup and install chrony:

```shell
timedatectl set-timezone Europe/London
dnf install chrony -y
systemctl start chronyd
systemctl enable chronyd
```
{: title='CentOS 8'}

```shell
timedatectl set-timezone Europe/London
sudo apt install chrony
sudo systemctl enable chrony.service
sudo systemctl restart chrony.service
```
{: title='Ubuntu'}

To change the nameservers, edit the configuration file:

* CentOS 8 - `/etc/chrony.conf`
* Ubuntu - `/etc/chrony/chrony.conf`

## Install the Google PAM

In order to begin with configuring 2FA we will need to install the google authenticator PAM


### CentOS 8

First, CentOS requires adding the EPEL repo:

```shell
sudo yum install epel-release
```

If you don't have the package epel-release you can install this manually:

```shell
sudo yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
```

Now, install the PAM:

```shell
sudo yum install google-authenticator qrencode-libs
```


### Ubuntu

```shell
sudo apt install libpam-google-authenticator
```

## Configure SSH to use 2FA with Google Authenticator PAM

> Whilst making the following changes, it is important not to close the initial SSH connection. This could lock you out if anything goes wrong.
{: .prompt-warning }

To begin, back up the SSH configuration and then edit it

Backup the sshd configuration:

```shell
sudo cp /etc/pam.d/sshd /etc/pam.d/sshd.bak
```

Update the configuration in `/etc/pam.d/sshd`:

```shell
auth  required  pam_google_authenticator.so secret=/home/${USER}/.ssh/google_authenticator nullok
auth  required  pam_permit.so
```
{: title='CentOS 8'}

The configuration for CentOS is slightly different as it uses SELINUX which doesn't allow the SSH Daemon to write files outside of the `.ssh` directory in your home folder.

Due to this, we need to specify where the configuration file location is with hte `secret` option.

```shell
auth  required pam_google_authenticator.so
auth  required pam_permit.so
```
{: title='Ubuntu'}

> `nullok` at the end of the line tells the PAM that this authentication method is optional. This allows users without a OATH-TOTP token to still log in just using their SSH key. Once all users have an OATH-TOTP token, you can remove `nullok` from this line to make MFA mandatory.
{: .prompt-info }

you can now save and close the file.

We now need to configure SSH to support this authentication method:

First backup the SSH configuration:

```shell
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
```

Now look for the line `ChallengeResponseAuthentication`. change this to `yes`

```shell
# Change to no to disable s/key passwords
ChallengeResponseAuthentication yes
```
{: file='/etc/ssh/sshd_config'}

Save and close this file, then restart SSH to reload the configuration. This wont close your current open connections so you wont lose access.

```shell
sudo systemctl restart sshd
```

### Create your token

We now need to create our 2FA token, to do this we run the following command:

```shell
google-authenticator -s ~/.ssh/google_authenticator
```
{: title='CentOS 8'}

```shell
google-authenticator
```
{: title='Ubuntu'}

After you run this command you will be asked a few questions. The first question asks if authentication should be time based:

```shell
Do you want authentication tokens to be time-based (y/n) y
```

This PAM allows time-based or sequential-based tokens, Using sequential based means the token increases by 1 after each use. Using time-based means that the token is based on a certain point in time.

After answering this question a large QR Code will appear, using your phone authenticator app, take a picture of the QR Code to add it to your application. A URL is also provided above the QR Code to open in a browser if required.

The remaining options inform PAM how to function, I have listed these below with the options that I chose, you can change these as you see fit for your requirements.

```shell
Do you want me to update your "~/.google_authenticator" file (y/n) y
```

```shell
Do you want to disallow multiple uses of the same authentication
token? This restricts you to one login about every 30s, but it increases
your chances to notice or even prevent man-in-the-middle attacks (y/n) y
```

```shell
By default, a new token is generated every 30 seconds by the mobile app.
In order to compensate for possible time-skew between the client and the server,
we allow an extra token before and after the current time. This allows for a
time skew of up to 30 seconds between authentication server and client. If you
experience problems with poor time synchronization, you can increase the window
from its default size of 3 permitted codes (one previous code, the current
code, the next code) to 17 permitted codes (the 8 previous codes, the current
code, and the 8 next codes). This will permit for a time skew of up to 4 minutes
between client and server.
Do you want to do so? (y/n) n
```

```shell
If the computer that you are logging into isn't hardened against brute-force
login attempts, you can enable rate-limiting for the authentication module.
By default, this limits attackers to no more than 3 login attempts every 30s.
Do you want to enable rate-limiting (y/n) y
```

Once finished you can backup your secret key by copying the `~/.ssh/google-authenticator` file to a trusted location. You can also copy this to other servers to use on multiple machines, however it is worth keeping in mind that then if one server is attacked there is potential for an attacker to gain access to other servers.

## Make SSH Aware of 2FA

Re-open the sshd configuration file and add the following line to the bottom of the file. This tells SSH whcih authentication methods are required:

```shell
AuthenticationMethods publickey,password publickey,keyboard-interactive
```
{: file='/etc/ssh/sshd_config'}

Save and close the file.

Next, open the PAM sshd configuration file again and find the line `auth substack password-auth`. comment it out by adding a `#` to the start of the line:

```shell
# auth  substack  password-auth
```
{: file='/etc/pam.d/sshd'}

> If you want three factors of authentication, you can skip commenting this line
{: .prompt-tip }

Save and close the file, then restart SSH:

```shell
sudo systemctl restart sshd
```

Now login to the server with a different terminal session/window. Unlike last time, SSH should ask for your verification code. Upon entering it, you’ll be logged in. Even though you don’t see any indication that your SSH key was used, your login attempt used two factors. If you want to verify, you can add -v (for verbose).

## Avoid 2FA in certain situations (optional)


### User Accounts

There may be some situations where a specific user or service account needs SSH access without 2FA enabled. For example, if an application doesn’t have a way to request the verification code, the request may get stuck until the SSH connection times out.

To allow MFA for some accounts and SSH key only for others, make sure the configuration in `/etc/pam.d/sshd` contains the `nullok` option as shown in previous steps.

After setting this, simply run the `google-authenticatior`  command for any users that require 2FA.

### Specific Networks

There may be some situations where specific networks are trusted and dont require 2FA to be used, in these situations we can update the configuration with the following:

```shell
auth [success=1 default=ignore] pam_access.so accessfile=/etc/security/access-local.conf
auth required pam_google_authenticator.so nullok
```

Create the device authentication configuration file for the specified ip addresses:

```shell
# Two-factor can be skipped on local network
+ : ALL : 10.0.0.0/24
+ : ALL : LOCAL
- : ALL : ALL
```
{: file='/etc/security/access-local.conf'}

Local login attempts from 10.0.0.0/24 will not require two-factor authentication, while all others do.
Now we need to edit the ssh daemon configuration file.

> Please keep in mind that this could add a security risk if not locked down sufficiently
{: .prompt-warning }

Restart the SSH daemon:

```shell
systemctl restart sshd
```

## Final Thoughts

This how-to guide has taken you through how to add 2FA authentication using google authentication via your computer and  your phone making your system considerably more secure. It is now much more difficult for a brute force attack via SSH.

