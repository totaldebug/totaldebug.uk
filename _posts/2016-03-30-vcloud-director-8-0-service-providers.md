---
id: 763
title: vCloud Director 8.0 for Service Providers
date: 2016-03-30T11:49:07+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=763
permalink: /vcloud-director-8-0-service-providers/
post_views_count:
  - "517"
  - "517"
categories:
  - VMware
tags:
  - director
  - features
  - nsx
  - providers
  - release
  - service
  - tenants
  - vcloud
---
As most of you will now be aware VMware decided to end availability for vCloud Director and shift to only allow service providers to utilise the product.  
<!--more-->

Originally the idea was that organisations would use vCloud Director for test environments but as the &#8220;Cloud&#8221; becomes cheaper and companies move their hosting out to 3rd party providers it makes sense for VMware to push consumers towards hosted platforms for cheaper billing and better support.

With the release of the vRealize product suite we see the new Automation product that allows users to automate deployments on hosted vCloud platforms which is a great step forwards. 

**So what&#8217;s new in vCloud Director 8.0?** 

  1. vSphere 6.0 Support: Support for vSphere 6.0 in backward compatibility mode.
  2. NSX support: Support for NSX 6.1.4 in backward compatibility mode. This means that tenants&#8217; consumption capability is unchanged and remains at the vCloud Networking and Security feature level of vCloud Director 5.6.
  3. Organization virtual data center templates: Allows system administrators to create organization virtual data center templates, including resource delegation, that organization users can deploy to create new organization virtual data centers.
  4. vApp enhancements: Enhancements to vApp functionality, including the ability to reconfigure virtual machines within a vApp, and network connectivity and virtual machine capability during vApp instantiation.
  5. OAuth support for identity sources: Support for OAuth2 tokens.
  6. Tenant throttling: This prevents a single tenant from consuming all of the resources for a single instance of vCloud director. Ensuring fairness of execution and scheduling among tenants. 

So not much has changed even though the version number has jumped quite dramatically. One thing that i will be interested in seeing is if the NSX Support adds much more functionality and what the upgrade paths are from vCNS to NSX for existing providers.