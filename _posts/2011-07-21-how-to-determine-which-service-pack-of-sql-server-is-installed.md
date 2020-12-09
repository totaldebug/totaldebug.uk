---
id: 51
title: How to determine which service pack of sql server is installed
date: 2011-07-21T09:03:27+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=51
permalink: /how-to-determine-which-service-pack-of-sql-server-is-installed/
post_views_count:
  - "3053"
  - "3053"
categories:
  - MSSQL
tags:
  - level
  - MSSQL
  - service pack
  - sql
  - sql version
  - version
---
To get to know what service pack is installed on a sql server instance you can obtain the current version of SQL Server and then look up to which service pack it correspond or you may use query against SQL Server instances starting from sql server 2005.  
<!--more-->

[crayon lang=&#8221;sql&#8221;]  
SELECT SERVERPROPERTY(&#8216;productversion&#8217;) as productversion  
,SERVERPROPERTY(&#8216;productlevel&#8217;) as productlevel  
,SERVERPROPERTY(&#8216;edition&#8217;) as edition  
[/crayon]

which returns exactly what you need like

product version         productlevel              edition  
&#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211; &#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211; &#8212;&#8212;&#8212;&#8212;&#8212;&#8212;&#8211;  
9.00.3068.00           SP2                             Developer Edition

For more information read Microsoft Knowledge Base article [321185](http://support.microsoft.com/?kbid=321185).  
To determine what is the version of SQL Server inctance run query.

[crayon lang=&#8221;sql&#8221;]select @@version[/crayon]

Then look up the version number up in one of the tables below.

For SQL Server 2005:

> <table border="1" cellspacing="1" cellpadding="2">
>   <tr>
>     <th align="right">
>       @@version
>     </th>
>     
>     <th align="left">
>       Version and Service Pack
>     </th>
>   </tr>
>   
>   <tr>
>     <td>
>           9.00.4028.00
>     </td>
>     
>     <td>
>       SQL Server 2005 with service pack 3
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       9.00.3054.00
>     </td>
>     
>     <td>
>       SQL Server 2005 with service pack 2 GDR2.
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       9.00.3050
>     </td>
>     
>     <td>
>       SQL Server 2005 with service pack 2 GDR1.
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       9.00.3042
>     </td>
>     
>     <td>
>       SQL Server 2005 with service pack 2.
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       2005.90.2047
>     </td>
>     
>     <td>
>       SQL Server 2005 with service pack 1
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       2005.90.1399
>     </td>
>     
>     <td>
>       SQL Server 2005 with no service pack applied
>     </td>
>   </tr>
> </table>

For SQL Server 2000:

> <table border="1" cellspacing="1" cellpadding="2">
>   <tr>
>     <th align="right">
>       @@version
>     </th>
>     
>     <th align="left">
>       Version and Service Pack
>     </th>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       8.00.2039
>     </td>
>     
>     <td>
>       SQL Server 2000 with Service Pack 4
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       8.00.760
>     </td>
>     
>     <td>
>       SQL Server 2000 with Service Pack 3a
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       8.00.760
>     </td>
>     
>     <td>
>       SQL Server 2000 with Service Pack 3.
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       8.00.532
>     </td>
>     
>     <td>
>       SQL Server 2000 with Service Pack 2
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       8.00.384
>     </td>
>     
>     <td>
>       SQL Server 2000 with Service Pack 1
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       8.00.194
>     </td>
>     
>     <td>
>       SQL Server 2000 with no service pack applied
>     </td>
>   </tr>
> </table>

For SQL Server 7:

> <table border="1" cellspacing="1" cellpadding="2">
>   <tr>
>     <th align="right">
>       version
>     </th>
>     
>     <th align="left">
>       Service Pack
>     </th>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       7.00.1063
>     </td>
>     
>     <td>
>       SQL Server 7 with Service Pack 4
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       7.00.961
>     </td>
>     
>     <td>
>       SQL Server 7 with Service Pack 3
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       7.00.842
>     </td>
>     
>     <td>
>       SQL Server 7 with Service Pack 2
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       7.00.699
>     </td>
>     
>     <td>
>       SQL Server 7 with Service Pack 1
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       7.00.623
>     </td>
>     
>     <td>
>       SQL Server 7 with no service pack applied
>     </td>
>   </tr>
> </table>

For SQL Server 6.5:

> <table border="1" cellspacing="1" cellpadding="2">
>   <tr>
>     <th align="right">
>       version
>     </th>
>     
>     <th align="left">
>       Service Pack
>     </th>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       6.50.479
>     </td>
>     
>     <td>
>       SQL Server 6.5 with Service Pack 5a (updated)
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       6.50.416
>     </td>
>     
>     <td>
>       SQL Server 6.5 with Service Pack 5a.
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       6.50.415
>     </td>
>     
>     <td>
>       SQL Server 6.5 with Service Pack 5
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       6.50.281
>     </td>
>     
>     <td>
>       SQL Server 6.5 with Service Pack 4
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       6.50.258
>     </td>
>     
>     <td>
>       SQL Server 6.5 with Service Pack 3
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       6.50.240
>     </td>
>     
>     <td>
>       SQL Server 6.5 with Service Pack 2
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       6.50.213
>     </td>
>     
>     <td>
>       SQL Server 6.5 with Service Pack 1
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       6.50.201
>     </td>
>     
>     <td>
>       SQL Server 6.5 with no service pack applied
>     </td>
>   </tr>
> </table>

For SQL Server 6:

> <table border="1" cellspacing="1" cellpadding="2">
>   <tr>
>     <th align="right">
>       version
>     </th>
>     
>     <th align="left">
>       Service Pack
>     </th>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       6.00.151
>     </td>
>     
>     <td>
>       SQL Server 6 with Service Pack 3
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       6.00.139
>     </td>
>     
>     <td>
>       SQL Server 6 with Service Pack 2
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       6.00.124
>     </td>
>     
>     <td>
>       SQL Server 6 with Service Pack 1
>     </td>
>   </tr>
>   
>   <tr>
>     <td align="right">
>       6.00.121
>     </td>
>     
>     <td>
>       SQL Server 6 with no service pack applied
>     </td>
>   </tr>
> </table>