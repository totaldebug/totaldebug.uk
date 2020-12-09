---
id: 101
title: 'Assigning &#8220;Send As&#8221; Permissions to a user'
date: 2011-12-06T10:54:44+00:00
author: marksie1988
layout: post
guid: http://35.176.61.220/?p=101
permalink: /assigning-send-as-permissions-to-a-user/
post_views_count:
  - "2994"
  - "2994"
slide_template:
  - ""
categories:
  - Exchange
---
<span style="font-family: Verdana; font-size: x-small;">It was brought to my attention that following the steps listed in KB327000 (</span>[<span style="font-family: Verdana; font-size: x-small;">http://support.microsoft.com/?kbid=327000</span>](http://support.microsoft.com/?kbid=327000)<span style="font-family: Verdana; font-size: x-small;">), which applies to Exchange 2000 and 2003, to assign a user &#8220;Send As&#8221; permission as another user did not appear to work.  I too tried to follow the steps and found that they did not work. I know this feature works, so I went looking around for other documentation on this and found KB281208 (</span>[<span style="font-family: Verdana; font-size: x-small;">http://support.microsoft.com/?kbid=281208</span>](http://support.microsoft.com/?kbid=281208)<span style="font-family: Verdana; font-size: x-small;">) which applies to Exchange 5.5 and 2000.  Following the steps in KB281208 properly gave an user &#8220;Send As&#8221; permission as another user. But I found the steps listed in KB281208 were not complete either. The additional step that I performed was to remove all other permissions other than &#8220;Send As&#8221;.  Here are the modified steps for KB281208 that I performed (changes noted in <span style="color: #0000ff;">blue</span>):</span>

<span style="font-family: Verdana; font-size: x-small;">1. Start Active Directory Users and Computers; click <strong>Start</strong>, point to <strong>Programs</strong>, point to<strong>Administrative Tools</strong>, and then click <strong>Active Directory Users and Computers</strong>.</span>

<span style="font-family: Verdana; font-size: x-small;">2. On the <strong>View</strong> menu, make sure that <strong>Advanced Features</strong> is selected.</span>

<span style="font-family: Verdana; font-size: x-small;">3. Double-click the user that you want to grant send as rights for, and then click the<strong>Security</strong> tab.</span>

<span style="font-family: Verdana; font-size: x-small;">4. Click <strong>Add</strong>, click the user that you want to give send as rights to, and then check <strong>send as</strong> under <strong>allow</strong> in the <strong>Permissions</strong> area.</span>

<span style="color: #0000ff; font-family: Verdana; font-size: x-small;">4.5  Remove all other permissions granted by default so only the <strong>send as</strong> permission is granted.</span>

<span style="font-family: Verdana; font-size: x-small;">5. Click <strong>OK</strong> to close the dialog box.</p> 

<p>
  So after I verified that the steps for KB281208 worked, I was curious as to why the steps for KB327000 did not work.  What I found was that Step #7 of KB327000 applied to the permission to &#8220;User Objects&#8221; instead of &#8220;This Object Only&#8221;.  Here are the modified steps for KB327000 that I performed:</span>
</p>

<p>
  <span style="font-family: Verdana; font-size: x-small;">1. On an Exchange computer, click <strong>Start</strong>, point to <strong>Programs</strong>, point to <strong>Microsoft Exchange</strong>, and then click <strong>Active Directory Users and Computers</strong>.</span>
</p>

<p>
  <span style="font-family: Verdana; font-size: x-small;">2. On the <strong>View</strong> menu, click to select <strong>Advanced Features</strong>.</span>
</p>

<p>
  <span style="font-family: Verdana; font-size: x-small;">3. Expand <strong>Users</strong>, right-click the <em>MailboxOwner</em> object where you want to grant the permission, and then click <strong>Properties</strong>.</span>
</p>

<p>
  <span style="font-family: Verdana; font-size: x-small;">4. Click the <strong>Security</strong> tab, and then click <strong>Advanced</strong>.</span>
</p>

<p>
  <span style="font-family: Verdana; font-size: x-small;">5. In the <strong>Access Control Settings for <em>MailboxOwner</em></strong> dialog box, click <strong>Add</strong>.</span>
</p>

<p>
  <span style="font-family: Verdana; font-size: x-small;">6. In the <strong>Select User, Computer, or Group</strong> dialog box, click the user account or the group that you want to grant &#8220;Send as&#8221; permissions to, and then click <strong>OK</strong>.</span>
</p>

<p>
  <span style="font-family: Verdana; font-size: x-small;">7. In the <strong>Permission Entry for <em>MailboxOwner</em></strong> dialog box, click <strong><span style="color: #0000ff;">This Object Only</span></strong> in the<strong>Apply</strong> onto list.</span>
</p>

<p>
  <span style="font-family: Verdana; font-size: x-small;">8. In the <strong>Permissions</strong> list, locate <strong>Send As</strong>, and then click to select the <strong>Allow</strong> check box.</span>
</p>

<p>
  <span style="font-family: Verdana; font-size: x-small;">9. Click <strong>OK</strong> three times to close the dialog boxes.</p> 
  
  <p>
    The KB articles were updated to include correct information. But, if you had problems with this in the past, this might be why!</span>
  </p>