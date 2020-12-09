---
id: 718
title: Mikrotik OpenVPN Server with Linux Client
date: 2015-07-29T11:57:50+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=718
permalink: /mikrotik-openvpn-server-with-linux-client/
xyz_fbap:
  - "1"
xyz_lnap:
  - "1"
xyz_twap:
  - "1"
post_views_count:
  - "3110"
categories:
  - CentOS
  - Mikrotik
tags:
  - centos
  - certificates
  - client
  - linux
  - mikrotik
  - openvpn
  - ovpn
  - tls-client
  - tls-server
  - vpn
---
I spent quite some time trying to get the OpenVPN Server working on the Mikrotik Router with a Linux client, It caused some pain and I didnt want others to go through that. I have therefore written this guide, taking you from certificate creation all the way to VPN connectivity. 

For this tutorial I will have SSH to my Mikrotik (you can use a winbox terminal), I have chosen not to use WinBox for the configuration as its easier to deploy this way.  
<!--more-->

### Certificate Creation

First we need to create our certificate templates on our Mikrotik. 

<pre class="lang:default decode:true " >/certificate
add name=ca-template country=GB locality=Leeds organization=SpottedHyena state=WestYorkshire common-name="home.server.co.uk" key-size=2048 unit=IT </pre>

**Name (Optional):** This is the visual name for the template, set this as required.  
**Country (Optional:** The country that you are in, this should be denoted by the 2 letter prefix e.g. GB for Great Britain.  
**Locality (Optional):** This is the City / Town.  
**Organization (Optional):** If you are an Organization enter the name here.  
**State (Optional):** Your State / Province.  
**Common-Name (Required):** The common name should be the FQDN of your Server / Mikrotik, this cannot be an IP Address and must be a valid domain name accessible publicly.  
**Key-Size (Optional):** Although this is optional I would recommend setting it to at lease 2048 for security 1024 is the default and not as secure.  
**Unit (Optional):** this is the department the certificate belongs to. 

Once we have generated our template we now need to create a certificate request and submit it to our CA

<pre class="lang:default decode:true " >/certificate
create-certificate-request template=ca-template</pre>

Press enter and then type a passphrase, keep this safe it will be required when using the certificate. 

Once the certificate is created you will get 2 new files, using an FTP Client such as <a href="https://filezilla-project.org/" target="_Blank" >Filezilla</a> connect to the Mikrotik and download these two files: 

  1. certificate-request.pem
  2. certificate-requset_key.pem

Edit the certificate-request.pem file in your favourite <a href="https://notepad-plus-plus.org/" target="_Blank">Notepad Product</a> copy all of the contents from this file including the begin and end tags. 

Now we need to login to <a href="www.cacert.org" target="_blank">CAcert.org</a> (if you don&#8217;t have an account create one)  
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/07/CACert.png" alt="CACert" width="1845" height="528" class="aligncenter size-full wp-image-720" />](http://35.176.61.220/wp-content/uploads/2015/07/CACert.png)

Once logged in select &#8220;Domains&#8221; &#8220;Add&#8221; in here type the domain name you used for your &#8220;Common-Name&#8221; e.g. 35.176.61.220 (you dont need the subdomain if one was used) You will then be asked to verify the domain via an email to one of a list of possible email accounts, verify the domain before continuing. 

When the domain is verified go to &#8220;Server Certificate&#8221; &#8220;New&#8221;

Paste the contents of certificate-request.pem into the box and submit the request. 

This should be accepted straight away and you will receive your certificate in text form on the next page.  
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/07/cacert2.jpg" alt="cacert2" width="900" height="484" class="aligncenter size-full wp-image-721" />](http://35.176.61.220/wp-content/uploads/2015/07/cacert2.jpg)

Copy and Paste your Certificate Response from Cacert in a notepad and save that with .pem file ( In Here : certificate-response.pem )

### Private Key

We now need to convert the private key, this is generated in pkcs8 format, this is not supported by RouterOS. 

To import the private key use linux openssl and make a private-key file. 

<pre class="lang:default decode:true " >yum install openssl</pre>

Upload the certificate-requset_key.pem file to the Linux server and run the following command: 

<pre class="lang:default decode:true " >openssl rsa -in certificate-requset_key.pem -text</pre>

copy and paste export String (Include Begin and End tags) to a New File eg certificate-requset_key.key

### Import Certificate

Upload the files Certificate-Response.pem, certificate-requset_key.key and <a href="http://www.cacert.org/?id=3" target="_blank">ca.crt (root ca from CACert.org)</a> to your Mikrotik with Filezilla

We now need to import the Certificate-response.pem with the passphrase you set earlier: 

<pre class="lang:default decode:true " >/certificate
import file-name=certificate-response.pem</pre>

Now import the certificate-requset_key.key

<pre class="lang:default decode:true " >/certificate
import file-name=certificate-request_key.key</pre>

Now import the Intermidiate (CA Cert) from CACert.org

<pre class="lang:default decode:true " >/certificate
import file-name=ca.crt</pre>

**Always import the certificate first, then the key.** You should be able to do a /certificate print and see the entries for the files you imported. In the print output, look at the flags column and verify that the line with your certificate has a T and a K. If the K is missing, import the key one more time. If that still doesn’t work, ensure that your certificate and key match.

The default naming conventions used for certificates is a little confusing. You can rename a certificate by running set name=firewall.35.176.61.220 number=0 (run a /certificate print to get the right number).

### OpenVPN Server Configuration

(Credit to <a href="https://major.io/2015/05/01/howto-mikrotik-openvpn-server/" target="_Blank">major.io</a> for parts of this section.

Now we are ready to begin the configuration of our OpenVPN Server

<pre class="lang:default decode:true " >/interface ovpn-server server
set certificate=firewall.35.176.61.220 cipher=aes256 default-profile=default-encryption enabled=yes
</pre>

This tells the device that we want to use our certificate we created and imported earlier along with AES256 Ciphers, there are more ciphers available however at the time of writing AES256 was the most secure available. We are also selecting **default-encriotion** profile, we will configure this in more detail later.

We now need to add an OpenVPN interface to the Mikrotik. You can have multiple OpenVPN Server profiles running under the same server. They will all share the same certificate, but each may have different configurations. Below we create the first porfile: 

<pre class="lang:default decode:true " >/interface ovpn-server
add name=openvpn-inbound user=openvpn</pre>

There is now a profile with a username **openvpn**. That will be the username that we use to connect to this VPN server.

### Secrets

The router needs a way to identify the user we just created:

<pre class="lang:default decode:true " >/ppp secret
add name=openvpn password=ovpnpassword profile=default-encryption</pre>

### Profiles

We have referred to this default-encryption profile and now it’s time to configure it. This is one of the things I prefer to configure using the Winbox GUI or the web interface since there are plenty of options to review. (in winbox select PPP then the profiles tab, open default-encryption profile)

The most important part is how you connect the VPN connection into your internal network. You have a few options here. You can configure an IP address that will always be assigned to this connection no matter what. There are upsides and downsides with that choice. You will always get the same IP on the inside network but you won’t be able to connect to the same profile with multiple clients.

I prefer to set the bridge option to my internal network bridge (which I call bridge1). That allows me to use my existing bridge configuration and filtering rules on my OpenVPN tunnels. My configuration looks something like this:

<pre class="lang:default decode:true " >/ppp profile
set 1 bridge=bridge1 local-address=dhcp_pool1 only-one=no remote-address=dhcp_pool1</pre>

Here we have told the router that we want VPN Connections to use the main bridge, and should get its local and remote addresses from my normal DHCP Pool. In addition we are allowing multiple connections to this profile. 

### Firewall Rule

The following firewall rule will be required to allow traffic into the OpenVPN Port:

<pre class="lang:default decode:true " >/ip firewall filter add chain=input dst-port=1194 protocol=tcp</pre>

### OpenVPN Client

This is where I got stuck the most, no articles explain where to get the Certificate for the Client from, for a seasoned pro this may seem like something very simple however to a newbie to this type of deployment its information I really could have done with! 

Well the answer I now know is quite simple, you use the same Certificate for a Client and Server, Lots of articles I found mentioned having a client cert but that didnt seem to work for me. 

First we must install OpenVPN and create the configuration

<pre class="lang:default decode:true " >yum install openvpn -y</pre>

The configuration files live here: /etc/openvpn/

<pre class="lang:default decode:true " >cd /etc/openvpn/</pre>

we will need to create **firewall-auth.txt** and **home.up** see the contents of these files below: 

<pre class="lang:default decode:true " title="vi firewall-auth.txt" >username
password</pre>

The firewall-auth.txt file holds our username and password, this will allow OpenVPN to login and restart the connection without user interaction. 

### Required Certificates: 

<pre class="lang:default decode:true " >openssl dhparam -out dh2048.pem 2048</pre>

This is our Diffie–Hellman file which is required by OpenVPN. 

We also need to copy the following files ca.crt, certificate-response.crt and private-key.key

<pre class="lang:default decode:true " title="vi MyVpn.ovpn"  >dev tun
pull
tls-client
dh dh2048.pem
ca ca.crt
cert certificate-response.crt
key certificate-request_key.key
remote firewall.35.176.61.220 1194 tcp-client
persist-key
script-security 3
cipher AES-256-CBC
auth-nocache
auth-user-pass firewall-auth.txt
ping 15
ping-restart 45
ping-timer-rem
persist-tun
verb 3
log-append /var/log/openvpn.log
</pre>

This is the main configuration file, Below I have explained what each line means:  
**dev tun:**  
**pull:**  
**tls-client:**  
**dh dh2048.pem:**  
**ca ca.crt:**  
**cert certificate-response.crt:**  
**key certificate-request_key.key:**  
**remote firewall.35.176.61.220 1194 tcp-client:**  
**persist-key**  
**script-security 3**  
**cipher AES-256-CBC**  
**auth-nocache**  
**auth-user-pass firewall-auth.txt**  
**ping 15**  
**ping-restart 45**  
**ping-timer-rem**  
**persist-tun**  
**verb 3**  
**log-append /var/log/openvpn.log**

### Testing

To test the VPN is quite simple, open 2x SSH windows to your Client Linux Server.

In the first SSH Window run: 

<pre class="lang:default decode:true " >openvpn /etc/openvpn/MyVpn.ovpn</pre>

In the second SSH Window run:

<pre class="lang:default decode:true " >tail -f /var/log/openvpn.log</pre>

Watch the log closely, you will see errors in here which will help with troubleshooting any issues. 

### Troubleshooting

**Compression:** At the time of writing compression is not supported by Mikrotik, please make sure no LZO lines are present in the configuration. 

**Certificates:** Check that your certificate and key were imported properly and that your client is configured to trust the self-signed certificate or the CA you used.

### Security

There are some security improvements that could be made to this configuration, however this is to get you up and running. 

  1. Limit the port access to a specific Source IP Address so that only you can connect
  2. Configre better passwords, the ones shown are examples only
  3. Consider using a seperate bridge so that the VPN has its own filters and rules
  4. Change the security of the firewall-auth.txt and home.up files to 600

Hopefully this will be helpful to someone out there. 

If you have any issues add a comment below and I will get back to you ASAP.