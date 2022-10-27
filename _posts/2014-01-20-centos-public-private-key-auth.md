---
title: CentOS Use Public/Private Keys for Authentication
date: 2014-01-20
categories: [Linux]
tags: [authentication, public key, private key, ssh]
---
The following Tutorial walks you through how to setup authentication using a key pair to negotiate the connection, stopping the requirement for passwords.
<!--more-->

1.First, create a public/private key pair on the client that you will use to connect to the server (you will need to do this from each client machine from which you connect):

```shell
ssh-keygen -t rsa
```

Leave the passphrase blank if you dont want to receive a prompt for this.

This will create two files in your ~/.ssh directory called: id\_rsa and id\_rsa.pub The first: id\_rsa is your private key and the second: id\_rsa.pub is your public key.

2. Now set permissions on your private key:

```shell
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
```

3. Copy the public key (id\_rsa.pub) to the server and install it to the authorized\_keys list:

```shell
cat id_rsa.pub &gt;&gt; ~/.ssh/authorized_keys
```

> Once you've imported the public key, you can delete it from the server.
{: .prompt-info }

4. Set file permissions on the server:

```shell
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

The above permissions are _required_ if StrictModes is set to yes in /etc/ssh/sshd_config (the default).

5. Ensure the correct SELinux contexts are set:

```shell
restorecon -Rv ~/.ssh
```

Now when you login to the server you shouldn&#8217;t be prompted for a password (unless you entered a passphrase). By default, ssh will first try to authenticate using keys. If no keys are found or authentication fails, then ssh will fall back to conventional password authentication.

> If you want access to and from some servers you would need to complete this process on each **client server** and **master server**
{: .prompt-info }

If you have any issues with setting this up, please let me know over on my [Discord](https://discord.gg/6fmekudc8Q).
