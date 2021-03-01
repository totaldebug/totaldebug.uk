---
title: vCenter 6.0 VCSA Deployment
date: 2015-03-23
layout: post
---
This article covers the deployment on the vCenter 6.0 VCSA, you will see that this process is radically different from previous processes.

<!--more-->

1. Download VCSA 6.0 from the VMware Website.
2. Mount the ISO on your computer.
3. go to the VCSA folder and install the VMware Client Intergration Plugin.
4. launch vcsa-setup.html from the ISO.
5. you will be prompted to Install or Upgrade, Choose Install
6. Accept the terms and click next
7. Enter the FQDN / IP and user details for an ESXi Host
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/03/connect_to_target.png" alt="connect to target server" width="1258" height="630" class="aligncenter size-full wp-image-646" />](http://35.176.61.220/wp-content/uploads/2015/03/connect_to_target.png)
8. wait for validation then click yes on the certificate warning.
9. Enter the appliance name and root password.
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/03/vcsa_root_password.png" alt="VCSA Root Password" width="1252" height="623" class="aligncenter size-full wp-image-647" />](http://35.176.61.220/wp-content/uploads/2015/03/vcsa_root_password.png)
10. Select the install type, there are now 2 choices, you can either deploy the appliance as one virtual machine or two, when deploying as two virtual machines one would be the platform services controller and the second vCenter Server.
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/03/install_type.png" alt="Install Type" width="1255" height="622" class="aligncenter size-full wp-image-648" />](http://35.176.61.220/wp-content/uploads/2015/03/install_type.png)

11. Select the SSO type. You have the choice of setting up a new SSO Domain or joining an existing one if you already have one in place.
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/03/sso_type.png" alt="sso_type" width="1249" height="620" class="aligncenter size-full wp-image-649" />](http://35.176.61.220/wp-content/uploads/2015/03/sso_type.png)

12. select the size of the appliance, this ranges from Tiny (10 hosts, 100 VMs) to Large (1,000 hosts and 10,000 VMs)
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/03/Appliaance_size.png" alt="Appliance Size" width="1248" height="616" class="aligncenter size-full wp-image-650" />](http://35.176.61.220/wp-content/uploads/2015/03/Appliaance_size.png)

13. Select the datastore you would like vCenter to reside on, tick &#8220;Enable Thin Disk Mode&#8221; if you want the Appliance to be Thin Provisioned.
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/03/select_datastore.png" alt="Select Datastore" width="1096" height="610" class="aligncenter size-full wp-image-658" />](http://35.176.61.220/wp-content/uploads/2015/03/select_datastore.png)
14. Select the database type, either Use an embedded database or Oracle database.
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/03/db_type.png" alt="Select Database Type" width="1092" height="599" class="aligncenter size-full wp-image-659" />](http://35.176.61.220/wp-content/uploads/2015/03/db_type.png)
15. Fill in the Network settings as required, choosing the correct network / IP addressing required for your network.
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/03/network_settings.png" alt="Network Settings" width="1103" height="609" class="aligncenter size-full wp-image-660" />](http://35.176.61.220/wp-content/uploads/2015/03/network_settings.png)
16. vCenter will now begin to deploy.
[<img loading="lazy" src="http://35.176.61.220/wp-content/uploads/2015/03/deploying_vcenter.png" alt="Deploying vCenter" width="1098" height="611" class="aligncenter size-full wp-image-661" />](http://35.176.61.220/wp-content/uploads/2015/03/deploying_vcenter.png)

You should now have a fully working vCenter Server Appliance 6.0, this install is much improved from previous versions and makes it much easier for basic users to get the appliance deployed.
