---
id: 74
title: 'Warning: Cannot modify header information &#8211; headers already sent by&#8230;'
date: 2011-08-08T16:33:20+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=74
permalink: /warning-cannot-modify-header-information-headers-already-sent-by/
post_views_count:
  - "3023"
categories:
  - php
tags:
  - header
  - href
  - javascript
  - location
  - php
  - refresh
---
Ok so today i was doing some PHP coding and get the dreaded header error caused me a bit of a headache as i needed to redirect some pages. After a bit of searching i managed to find an alternative to using:

[php]header(location:"index.php");[/php]

So to get rid of the error that this produces simply change it to any of the below:

[php]  
ob_start();

//script

header("Location:file.php");

ob\_end\_flush();  
[/php]

OR

[php]  
if ($success)  
{  
echo &#8216;<META HTTP-EQUIV="Refresh" Content="0; URL=success.php">&#8217;;  
exit;  
}  
else  
{  
echo &#8216;<META HTTP-EQUIV="Refresh" Content="0; URL=retry.php">&#8217;;  
exit;  
}  
[/php]

OR

[php]  
printf("<script>location.href=&#8217;errorpage.html'</script>");

[/php]

i used the last option as i found this worked best compared to the others with my program however they may all work well for your application