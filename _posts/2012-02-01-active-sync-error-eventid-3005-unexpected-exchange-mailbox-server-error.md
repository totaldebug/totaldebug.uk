---
title: Active Sync Error EventID 3005 Unexpected Exchange Mailbox Server Error
date: 2012-02-01
layout: post
---
One of our customers was getting the below error and it took ages to find a solution so I thought I would post it here.

```
Unexpected Exchange mailbox Server error: Server: [server.domain] User: [useremail] HTTP status code: [503]. Verify that the Exchange mailbox Server is working correctly.

For more information, see Help and Support Center at http://go.microsoft.com/fwlink/events.asp.
```
<!--more-->

This is how I fixed the issue:

1. Open IIS
2. Right click Default-Website
3. Click Properties
4. Click advanced
5. Review sites. most likely you will see host headers and ip address.
6. Click add
7. IP address = (all unassigned)
8. TCP Port = 80
9. Host Header Value = (Blank)
10. Click OK
11. delete the entry with the host headers and ip address assignerd.

This should resolve the issue please comment if you have any issues doing this.
