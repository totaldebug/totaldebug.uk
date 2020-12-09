---
id: 8
title: Mapping MSCRM fields from Opportunity Product to Quote Product
date: 2011-07-08T15:14:54+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=8
permalink: /mapping-mscrm-fields-from-opportunity-product-to-quote-product/
post_views_count:
  - "3019"
  - "3019"
categories:
  - Dynamics CRM
tags:
  - dynamics
  - mapping
  - mscrm
---
MSCRM has an oversight in the default Opportunity-Quote-Order process in taking fields entered at the Opportunity Product stage and having these mapped to any resulting Quote Product or Order Product records.  
<!--more-->

This means that any fields (such as the field we added to the Opportunity Product screen to track the Product Number of the Product entered from main post in this category) are not mapped over to the resulting Quote Products on our Quote. [<img loading="lazy" class="alignnone size-full wp-image-9" title="List of Opportunity Products" src="http://35.176.61.220/wp-content/uploads/2011/07/opportunityproduct-quoteproduct-1.jpg" alt="" width="420" height="256" />](http://35.176.61.220/wp-content/uploads/2011/07/opportunityproduct-quoteproduct-1.jpg) [<img loading="lazy" class="alignnone size-full wp-image-10" title="List of Quote Products mapped from an Opportunity" src="http://35.176.61.220/wp-content/uploads/2011/07/opportunityproduct-quoteproduct-2.jpg" alt="" width="420" height="243" />](http://35.176.61.220/wp-content/uploads/2011/07/opportunityproduct-quoteproduct-2.jpg)

This obviously would be confusing to the end-user!

However whilst MSCRM does not directly list the relationship between a Quote Product and Opportunity Product within the available Customisation User Interface – this relationship (and crucially it’s Mappings) are available to us.

The following steps allow us to add or remove mappings to this relationship, and ensure that our custom Product Number field is mapped across.

**STEP 1 &#8211;** Run a SQL Query against the MSCRM Database (typically X_MSCRM where X is your Organisation Name for the MSCRM Deployment) to determine the GUID Id of the Relationship between the Quote Product Entity and the Order Product Entity.

[crayon lang=&#8221;sql&#8221;]SELECT EntityMapId  
FROM EntityMapBase  
WHERE TargetEntityName=&#8217;quotedetail&#8217; AND SourceEntityName=&#8217;opportunityproduct'[/crayon]

**STEP 2 – **Take the output of this SQL Query and insert this into the following URL:

\[crayon]http://[x]/Tools/SystemCustomization/Relationships/Mappings/mappingList.aspx?mappingId=[y&#8221;>http://[x]/Tools/SystemCustomization/Relationships/Mappings/mappingList.aspx?mappingId=[y\]\[/crayon\]

Where [x] is the URL address of the MSCRM Deployment in question and [y] is the GUID Id output of the SQL Query

**STEP 3 – **This will present the Relationship Mapping screen for mapping attributes from the Opportunity Product entity to the Quote Product entity:

[<img loading="lazy" class="alignnone size-full wp-image-31" title="Relationship Mappings from Opportunity Product to Quote Product" src="http://35.176.61.220/wp-content/uploads/2011/07/opportunityproduct-quoteproduct-mappings.jpg" alt="" width="606" height="392" />](http://35.176.61.220/wp-content/uploads/2011/07/opportunityproduct-quoteproduct-mappings.jpg)

From here, any number of mappings can be added to define how the Products attached to an Opportunity are mapped across when a Quote is added to the Opportunity. (obviously any changes or additional mappings will need to be published in usual MSCRM fashion)

The same steps can also be used for controlling how fields are mapped across from Quotes to Orders in a similar fashion:

[crayon lang=&#8221;sql&#8221;]SELECT EntityMapId  
FROM EntityMapBase  
WHERE TargetEntityName=&#8217;salesorderdetail&#8217; AND SourceEntityName=&#8217;quotedetail'[/crayon]

And similarly how fields are mapped from Order Products to Invoice Products:

[crayon lang=&#8221;sql&#8221;]SELECT EntityMapId  
FROM EntityMapBase  
WHERE TargetEntityName=&#8217;invoicedetail&#8217; AND SourceEntityName=&#8217;salesorderdetail'[/crayon]

This is a useful technique when working with any custom fields in a Opportunity-Quote-Order process in MSCRM.