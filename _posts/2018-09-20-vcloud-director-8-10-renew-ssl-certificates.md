---
title: vCloud Director 8.10 – Renew SSL Certificates
date: "2018-09-20"
categories: [Virtualisation, VMware]
tags: [vcloud, director, ssl]
---

Today I had to renew SSL certificates for a vCloud Director 8.10 cell which had expired.

I could not find a working guide explaining the steps so this post covers everything required to replace expiring / expired certificates with new ones.

# First Cell Steps

First we lets check that the Cell doesn't have any running jobs:

```shell
/opt/vmware/vcloud-director/bin/cell-management-tool -u &lt;AdminUser&gt; cell --status
```

You will be prompted for your administrator account password.

Once you have done this you should see the following output:

```shell
Job count = 1
Is Active = true
In Maintenance Mode = false
```

We must now stop the task scheduler to quiesce the cell by running the command:

```shell
/opt/vmware/vcloud-director/bin/cell-management-tool -u &lt;AdminUser&gt; cell --quiesce true
```

```note
This command prevents new jobs from being started. Existing jobs continue to run until they complete or are cancelled.
```

When the Job Count = 0 and Is Active = false, it is safe to shut down the cell by running the command:

```shell
./cell-management-tool -u &lt;AdminUser&gt; cell --shutdown
```

Copy our old certificate store:

```shell
cp /usr/local/vmware/certificates.ks /usr/local/vmware/certificates-new.ks
```

Now we need to list the certificates in our new keystore:

```shell
/opt/vmware/vcloud-director/jre/bin/keytool -storetype JCEKS -keystore /usr/local/vmware/certificates-new.ks -list -storepass <password>
```

```note
The keystore location may be different on your server
```

We now need to delete the expired http and consoleproxy certificates from the keystore. Note that the root and intermediate certificates may not have expired so you can leave these in place

```shell
/opt/vmware/vcloud-director/jre/bin/keytool -delete -alias http -keystore /usr/local/vmware/certificates-new.ks -storetype JCEKS -storepass <password>
/opt/vmware/vcloud-director/jre/bin/keytool -delete -alias consoleproxy -keystore /usr/local/vmware/certificates-new.ks -storetype JCEKS -storepass <password>
```

Run the following to generate new certificates for HTTP and ConsoleProxy:

```shell
/opt/vmware/vcloud-director/jre/bin/keytool -keystore /usr/local/vmware/certificates-new.ks -storetype JCEKS -storepass <password> -genkey -keysize 2048 -keyalg RSA -alias http
/opt/vmware/vcloud-director/jre/bin/keytool -keystore /usr/local/vmware/certificates-new.ks -storetype JCEKS -storepass <password> -genkey -keysize 2048 -keyalg RSA -alias consoleproxy
```

Now we must generate our CSR files:

```shell
/opt/vmware/vcloud-director/jre/bin/keytool -keystore /usr/local/vmware/certificates-new.ks -storetype JCEKS -storepass <password> -certreq -alias http -file ~/http.csr
/opt/vmware/vcloud-director/jre/bin/keytool -keystore /usr/local/vmware/certificates-new.ks -storetype JCEKS -storepass <password> -certreq -alias consoleproxy -file ~/consoleproxy.csr
```

Once the files are created you will need to copy the contents to your SSL Provider in order to get your certificate. When you have the .cer file from them you can continue through this article.

Copy your new certificate cer files to your server, this can be done by copying the contents to a new file on the server or via a program like winSCP

Import the Certificates into the keystore:

```shell
/opt/vmware/vcloud-director/jre/bin/keytool -storetype JCEKS -storepass <password> -keystore /usr/local/vmware/certificates2018.ks -import -alias http -file http2018.cer
/opt/vmware/vcloud-director/jre/bin/keytool -storetype JCEKS -storepass <password> -keystore /usr/local/vmware/certificates2018.ks -import -alias consoleproxy -file consoleproxy2018.cer
```

Now we need to replace the existing certificates with the new certificates:

```shell
./cell-management-tool certificates -j -k /usr/local/vmware/certificates-new.ks -w <password>
./cell-management-tool certificates -p -k /usr/local/vmware/certificates-new.ks -w <password>
```

-j = Replace the keystore file named certificates used by the **http** endpoint.

-p =  Replace the keystore file named proxycertificates used by the **console proxy** endpoint.

Start the Cell:

```shell
service vmware-vcd start
```

# Multiple Cells

If you have multiple cells, simply copy the keystore to the other servers using an application like winSCP

Then run the following:

```shell
./cell-management-tool certificates -j -k /usr/local/vmware/certificates-new.ks -w <password>
./cell-management-tool certificates -p -k /usr/local/vmware/certificates-new.ks -w <password>
```

Re-start the Cell:

We must now stop the task scheduler to quiesce the cell by running the command:

```shell
/opt/vmware/vcloud-director/bin/cell-management-tool -u <AdminUser> cell --quiesce true
```

```note
This command prevents new jobs from being started. Existing jobs continue to run until they complete or are cancelled.
```

When the Job Count = 0 and Is Active = false, it is safe to shut down the cell by running the command:

```shell
./cell-management-tool -u <;AdminUser> cell --shutdown
```

```shell
service vmware-vcd start
```
