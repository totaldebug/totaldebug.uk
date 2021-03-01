---
title: Managing Application Settings in PHP
date: 2014-01-05
layout: post
thumb_img: thumb.jpg
content_img: thumb.jpg
---
There are multiple ways to save application settings/configurations in PHP. You can save them in INI, XML or PHP files as well as a database table. I prefer a combination of the latter two; saving the database connection details in a PHP file and the rest in a database table.
<!--more-->

The advantage of using this approach over the others will be apparent when developing downloadable scripts, as updates will not need to modify a configuration file of an already setup script.

To start create a table containing 3 fields: auto increment ID, setting name and setting value:

```mysql
CREATE TABLE IF NOT EXISTS `settings` (
  `setting_id` int(11) NOT NULL AUTO_INCREMENT,
  `setting` varchar(50) NOT NULL,
  `value` varchar(500) NOT NULL,
  PRIMARY KEY (`setting_id`),
  UNIQUE KEY `setting` (`setting`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
```

The following function updates the value of a setting by supplying it with the setting name and the new value.

```php
<?php
function SaveSetting($settingname, $settingvalue) {
    mysql_query("UPDATE settings SET `value`='$settingvalue' WHERE `setting`='$settingname'");
}
?>
```

The GetSetting function returns 1 or more values depending on the parameter passed. You can pass a setting name in a string or multiple settings in an array of strings. The latter will save you multiple trips to the database to perform a task that requires more than 1 setting like sending an email which needs the email server, protocol and credentials.

```php
<?php
function GetSetting($settingname) {
    if(!is_array($settingname)) {   //user passed a single setting name
        $result = mysql_query("SELECT * FROM settings WHERE setting='$settingname'");
        $setting = mysql_fetch_array($result);

        if(mysql_num_rows($result)) {
            return $setting['value'];
        }
        else {
            return null;
        }
    }

    else {   //user passed multiple setting names in an array
        $params = '';

        for($c = 0 ; $c &lt; count($settingname) ; $c++) {
            $params .= "setting='{$settingname[$c]}'";

            if($c != (count($settingname) - 1))
                $params .= ' OR ';
        }

        $result = mysql_query("SELECT * FROM settings WHERE " . $params);

        if(mysql_num_rows($result)) {
            $settings_array = array();

            while($setting = mysql_fetch_array($result)) {
                $settings_array[$setting['setting']] = $setting['value'];
            }

            return $settings_array;
        }
        else {
            return null;
        }

    }
}
?>
```

Here is an example of using the GetSetting function to initialize an email object.

```php
<?php
$setting = GetSetting(array('email_protocol', 'email_smtpauth',
    'email_server', 'email_port'));

$mail = new PHPMailer();
if($setting['email_protocol'] == 1) $mail-&gt;IsSMTP();
if($setting['email_smtpauth'] == 1) $mail-&gt;SMTPAuth = true;
$mail-&gt;Host = $setting['email_server'];
$mail-&gt;Port = $setting['email_port'];
?>
```

---
**NOTE:**

This code does not filter the values sent to SaveSetting(). To prevent SQL injection and XSS attacks please make sure you check the values before saving them and also after reading them using GetSetting().

---
