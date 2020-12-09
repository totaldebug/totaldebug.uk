---
id: 6274
title: vCloud Director 8.10 – Renew SSL Certificates
date: 2018-09-20T14:51:43+00:00
author: marksie1988
layout: post
guid: http://spottedhyena.co.uk/?p=6274
permalink: /vcloud-director-8-10-renew-ssl-certificates/
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
categories:
  - Linux
  - VMware
tags:
  - certificate
  - director
  - ssl
  - vcloud
  - vmware
---
Today I had to renew SSL certificates for a vCloud Director 8.10 cell which had expired.

I could not find a working guide explaining the steps so this post covers everything required to replace expiring / expired certificates with new ones.

# First Cell Steps

First we lets check that the Cell doesn&#8217;t have any running jobs:

<pre class="lang:default decode:true">/opt/vmware/vcloud-director/bin/cell-management-tool -u &lt;AdminUser&gt; cell --status</pre>

You will be prompted for your administrator account password.

Once you have done this you should see the following output:

<pre class="lang:default decode:true">Job count = 1
Is Active = true
In Maintenance Mode = false
</pre>

We must now stop the task scheduler to quiesce the cell by running the command:

<pre class="lang:default decode:true">/opt/vmware/vcloud-director/bin/cell-management-tool -u &lt;AdminUser&gt; cell --quiesce true</pre>

[nz\_icons icon=&#8221;icon-info&#8221; animate=&#8221;false&#8221; size=&#8221;small&#8221; type=&#8221;circle&#8221; icon\_color=&#8221;&#8221; background\_color=&#8221;&#8221; border\_color=&#8221;&#8221; /] **Note**: This command prevents new jobs from being started. Existing jobs continue to run until they complete or are cancelled.

When the Job Count = 0 and Is Active = false, it is safe to shut down the cell by running the command:

<pre class="lang:default decode:true">./cell-management-tool -u &lt;AdminUser&gt; cell --shutdown</pre>

Copy our old certificate store:

<pre class="lang:default decode:true">cp /usr/local/vmware/certificates.ks /usr/local/vmware/certificates-new.ks</pre>

Now we need to list the certificates in our new keystore:

<pre class="lang:default decode:true">/opt/vmware/vcloud-director/jre/bin/keytool -storetype JCEKS -keystore /usr/local/vmware/certificates-new.ks -list -storepass &lt;Password&gt;</pre>

[nz\_icons icon=&#8221;icon-info&#8221; animate=&#8221;false&#8221; size=&#8221;small&#8221; type=&#8221;circle&#8221; icon\_color=&#8221;&#8221; background\_color=&#8221;&#8221; border\_color=&#8221;&#8221; /] **Note**: The keystore location may be different on your server

We now need to delete the expired http and consoleproxy certificates from the keystore. Note that the root and intermediate certificates may not have expired so you can leave these in place

<pre class="lang:default decode:true">/opt/vmware/vcloud-director/jre/bin/keytool -delete -alias http -keystore /usr/local/vmware/certificates-new.ks -storetype JCEKS -storepass &lt;password&gt;
/opt/vmware/vcloud-director/jre/bin/keytool -delete -alias consoleproxy -keystore /usr/local/vmware/certificates-new.ks -storetype JCEKS -storepass &lt;password&gt;</pre>

Run the following to generate new certificates for HTTP and ConsoleProxy:

<pre class="lang:default decode:true">/opt/vmware/vcloud-director/jre/bin/keytool -keystore /usr/local/vmware/certificates-new.ks -storetype JCEKS -storepass &lt;password&gt; -genkey -keysize 2048 -keyalg RSA -alias http
/opt/vmware/vcloud-director/jre/bin/keytool -keystore /usr/local/vmware/certificates-new.ks -storetype JCEKS -storepass &lt;password&gt; -genkey -keysize 2048 -keyalg RSA -alias consoleproxy
</pre>

Now we must generate our CSR files:

<pre class="lang:default decode:true">/opt/vmware/vcloud-director/jre/bin/keytool -keystore /usr/local/vmware/certificates-new.ks -storetype JCEKS -storepass &lt;password&gt; -certreq -alias http -file ~/http.csr
/opt/vmware/vcloud-director/jre/bin/keytool -keystore /usr/local/vmware/certificates-new.ks -storetype JCEKS -storepass &lt;password&gt; -certreq -alias consoleproxy -file ~/consoleproxy.csr</pre>

Once the files are created you will need to copy the contents to your SSL Provider in order to get your certificate. When you have the .cer file from them you can continue through this article.

Copy your new certificate cer files to your server, this can be done by copying the contents to a new file on the server or via a program like winSCP

Import the Certificates into the keystore:

<pre class="lang:default decode:true">/opt/vmware/vcloud-director/jre/bin/keytool -storetype JCEKS -storepass &lt;password&gt; -keystore /usr/local/vmware/certificates2018.ks -import -alias http -file http2018.cer
/opt/vmware/vcloud-director/jre/bin/keytool -storetype JCEKS -storepass &lt;password&gt; -keystore /usr/local/vmware/certificates2018.ks -import -alias consoleproxy -file consoleproxy2018.cer</pre>

Now we need to replace the existing certificates with the new certificates:

<pre class="lang:default decode:true ">./cell-management-tool certificates -j -k /usr/local/vmware/certificates-new.ks -w &lt;password&gt;
./cell-management-tool certificates -p -k /usr/local/vmware/certificates-new.ks -w &lt;password&gt;</pre>

&#8211; j = Replace the keystore file named certificates used by the **http** endpoint.

-p =  Replace the keystore file named proxycertificates used by the **console proxy** endpoint.

Start the Cell:

<pre class="lang:default decode:true">service vmware-vcd start</pre>

# Multiple Cells

If you have multiple cells, simply copy the keystore to the other servers using an application like winSCP

Then run the following:

<pre class="lang:default decode:true ">./cell-management-tool certificates -j -k /usr/local/vmware/certificates-new.ks -w &lt;password&gt;
./cell-management-tool certificates -p -k /usr/local/vmware/certificates-new.ks -w &lt;password&gt;</pre>

Re-start the Cell:

We must now stop the task scheduler to quiesce the cell by running the command:

<pre class="lang:default decode:true">/opt/vmware/vcloud-director/bin/cell-management-tool -u &lt;AdminUser&gt; cell --quiesce true</pre>

[nz\_icons icon=&#8221;icon-info&#8221; animate=&#8221;false&#8221; size=&#8221;small&#8221; type=&#8221;circle&#8221; icon\_color=&#8221;&#8221; background\_color=&#8221;&#8221; border\_color=&#8221;&#8221; /] **Note**: This command prevents new jobs from being started. Existing jobs continue to run until they complete or are cancelled.

When the Job Count = 0 and Is Active = false, it is safe to shut down the cell by running the command:

<pre class="lang:default decode:true">./cell-management-tool -u &lt;AdminUser&gt; cell --shutdown
</pre>

<pre class="lang:default decode:true ">service vmware-vcd start</pre>

&nbsp;