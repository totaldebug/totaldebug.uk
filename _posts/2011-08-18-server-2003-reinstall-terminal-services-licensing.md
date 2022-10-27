---
title: Server 2003 Reinstall Terminal Services Licensing.
date: 2011-08-18 10:00:00 +0100
categories: [Microsoft, Windows, Terminal Services]
tags: [terminal, rds, licensing]
---

I came across an issue today where I needed to reinstall terminal services licensing but when you do this licensing is lost and needs to be re-applied.

I managed to resolve this issue by copying the licensing db to a different folder and then re-installing terminal services and copying it back.

  1. stop Terminal Services Licensing service
  2. Copy c:\windows\system32\LServer\TLSLic.edb
  3. Paste the db to a different location
  4. Uninstall Terminal Services Licensing from add remove components
  5. Re-Install Terminal Services Licensing
  6. stop Terminal Services Licensing service
  7. copy the TLSLic.edb back to c:\windows\system32\LServer\ overwriting the new db that is in there
  8. start Terminal Services Licensing service

Now you will notice that TS Licensing is working and all of your licences still work.


> You CANNOT move this to another server it is registered to that Licensing server!!!
{: .prompt-danger }
