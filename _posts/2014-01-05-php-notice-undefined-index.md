---
title: 'PHP Notice: Undefined index'
date: 2014-01-05
layout: post
---
I have had a few times when coding where I get the error PHP Notice: Undefined Index, I found the below solution to this issue which is an extremely simple fix!
<!--more-->

## How to Fix

One simple answer – isset() !

isset() function in PHP determines whether a variable is set and is not NULL. It returns a Boolean value, that is, if the variable is set it will return true and if the variable value is null it will return false. More details on this function can be found in PHP Manual

## Example

Let us consider an example. Below is the HTML code for a comment form in a blog.

```html
<form name="myform" id="myform" method="post" action="add_comment.php">
    <h2>Please leave a comment:</h2>
    <input type="text" id="username" name="username" value="Enter Username" /><br />
    <input type="text" id="email" name="email" value="Enter Email" /><br />
    <textarea id="comment" name="comment">Enter Comment</textarea><br />
    <br /><br />
    <input type="checkbox" id="notify_box" name="notify_box" value="Y">
    Notify me when a new post is published. <br />
    <br />
    <input type="submit" value="Post Comment"></form>
```

Here is the PHP file ‘add_comment.php’ which takes the data passed from the comment form.

```php
<?php
    $uName  = $_POST['username'];
    $eMail  = $_POST['email'];
    $comment= $_POST['comment'];
    $notify = $_POST['notify_box'];
    // send the data to the database
?>
```

What happens is, when the check-box is CHECKED, the code works fine. But when it is not, then I am getting the warning as mentioned above. &#8220;Warning: Undefined index:&#8221;

So to fix this, let us make use of the magic function. Now the code appears like this.

```php
<?php
    $notify = "";
    $uName  = $_POST['username'];
    $eMail  = $_POST['email'];
    $comment= $_POST['comment'];
    if(isset($_POST['notify_box'])){ $notify = $_POST['notify_box']; }
    // send the data to the database
?>
```

What happens here is, I am checking first whether the check box is CHECKED (or set) using a condition. And if the condition is true I am getting the value passed.

The same fix can be used for the above warning when working with $\_SESSION, $\_POST arrays.
But, there instances where harmless notices can be ignored.
For an example,
I have a page which can be accesses in below 3 ways.
www.someexample.com/comments.php
www.someexample.come/comments.php?action=add
www.someexample.com/comments.php?action=delete
All these URL’s go to the same page but each time performs a different task.
So when I try to access the page through the first URL, it will give me the ‘Undefined index’ notice since the parameter ‘action’ is not set.

We can fix this using the isset() function too. But on this instance, we can just ignore it by hiding the notices like this.
error\_reporting(E\_ALL ^ E_NOTICE);

You can also turn off error reporting in your php.ini file or .htaccess file, but it is not considered as a wise move if you are still in the testing stage.

This is another simple solution in PHP for a common complex problem. Hope it is useful.

---
**NOTE:**

This is an example only my form has no security hardening. Use at own risk.

---
