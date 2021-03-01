---
title: 'Warning: Cannot modify header information &#8211; headers already sent by&#8230;'
date: 2011-08-08
layout: post
---
Ok so today i was doing some PHP coding and get the dreaded header error caused me a bit of a headache as i needed to redirect some pages. After a bit of searching i managed to find an alternative to using:

```php
header(location:"index.php");
```

So to get rid of the error that this produces simply change it to any of the below:

```php
ob_start();

//script

header("Location:file.php");

ob\_end\_flush();
```

OR

```php
if ($success)
{
echo '<META HTTP-EQUIV="Refresh" Content="0; URL=success.php">';
exit;
}
else
{
echo '<META HTTP-EQUIV="Refresh" Content="0; URL=retry.php">';
exit;
}
```

OR

```php
printf("<script>location.href=&#8217;errorpage.html'</script>");
```

I used the last option as I found this worked best compared to the others with my program however they may all work well for your application
