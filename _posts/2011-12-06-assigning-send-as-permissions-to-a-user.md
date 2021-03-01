---
title: 'Assigning &#8220;Send As&#8221; Permissions to a user'
date: 2011-12-06
layout: post
---

It was brought to my attention that following the steps listed in [KB327000](http://support.microsoft.com/?kbid=327000), which applies to Exchange 2000 and 2003, to assign a user &#8220;Send As&#8221; permission as another user did not appear to work.  I too tried to follow the steps and found that they did not work. I know this feature works, so I went looking around for other documentation on this and found [KB281208](http://support.microsoft.com/?kbid=281208) which applies to Exchange 5.5 and 2000.  Following the steps in KB281208 properly gave an user &#8220;Send As&#8221; permission as another user. But I found the steps listed in KB281208 were not complete either. The additional step that I performed was to remove all other permissions other than &#8220;Send As&#8221;.  Here are the modified steps for KB281208 that I performed (changes noted in <span style="color: #0000ff;">blue</span>):

1. Start Active Directory Users and Computers; click **Start**, point to **Programs**, point to **Administrative Tools**, and then click **Active Directory Users and Computers**.
2. On the **View** menu, make sure that **Advanced Features** is selected.
3. Double-click the user that you want to grant send as rights for, and then click the**Security** tab.
4. Click **Add**, click the user that you want to give send as rights to, and then check **send as** under **allow** in the **Permissions** area.
5. Remove all other permissions granted by default so only the **send as** permission is granted.
6. Click **OK** to close the dialog box.


So after I verified that the steps for KB281208 worked, I was curious as to why the steps for KB327000 did not work.  What I found was that Step #7 of KB327000 applied to the permission to &#8220;User Objects&#8221; instead of &#8220;This Object Only&#8221;.  Here are the modified steps for KB327000 that I performed:

1. On an Exchange computer, click **Start**, point to **Programs**, point to **Microsoft Exchange**, and then click **Active Directory Users and Computers**.
2. On the **View** menu, click to select **Advanced Features**.
3. Expand **Users**, right-click the <em>MailboxOwner</em> object where you want to grant the permission, and then click **Properties**.
4. Click the **Security** tab, and then click **Advanced**.
5. In the **Access Control Settings for <em>MailboxOwner</em>** dialog box, click **Add**.
6. In the **Select User, Computer, or Group** dialog box, click the user account or the group that you want to grant &#8220;Send as&#8221; permissions to, and then click **OK**.
7. In the **Permission Entry for <em>MailboxOwner</em>** dialog box, click **<span style="color: #0000ff;">This Object Only</span>** in the**Apply** onto list.
8. In the **Permissions** list, locate **Send As**, and then click to select the **Allow** check box.
9. Click **OK** three times to close the dialog boxes.

The KB articles were updated to include correct information. But, if you had problems with this in the past, this might be why!
