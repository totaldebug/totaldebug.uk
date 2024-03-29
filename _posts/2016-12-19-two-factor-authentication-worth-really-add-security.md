---
title: 'Two-Factor Authentication: is it worth it, does it really add more security?'
date: 2016-12-19 20:00:00 +0100
category: [Musings]
tags: [2fa]
---

As we all move to a digital age, adding more and more personal information to the internet security has become a real issue, in recent years there have been hack attempts on well-known brands, including LastPass, LinkedIn, Twitter and Adobe.

This has cast a light on the problems that passwords bring and how vulnerable users are as a result. Most of these companies are now implementing Two-Factor authentication, but is it really as secure as we are lead to believe? what are its pitfalls?

In this article i'm going to go through some of the pros and cons relating to Two-Factor authentication (or 2FA)

## What is 2FA?

Simply put Two-Factor authentication / multi-factor authentication is the ability to employ multiple layers of authentication, in most cases this would be your password and then a token that expires after a short period of time.

Other types of authentication could include but are not limited to:

* Finger Print Recognition
* Retinal scanners
* Face Recognition

**Try this example:**
You have a house, with a safe, inside is a gold bar. The safe has a combination on it that only you know and the house has a door that is locked, only you have the key for this door. It takes two steps of "authentication" to get into the safe and retrieve your gold.

If you added more doors with different locks this would add more "authentication" and it would make the house harder to enter to get to the safe.

## How does it work?

There are multiple ways that 2FA tokens work, one method is time based. Both the server and client take the current time e.g. 15:15 they then turn this into a number 1515 and run it through an algorithm that hashes it into a multiple digit code, both devices use the same algorithm to generate the code and thus both generate the same code (as long as the times match), this is obviously a very simplified explanation but shows how both the server and client generate the same codes securely.

To setup 2FA in most cases the website you are using will have a QR-Code that you can scan into an app such as Authy or Google Authenticator, this will then display a numbered token for around 8 seconds before expiring and a new code being generated. After you have entered your conventional username and password you would be prompted for your "Token" once entered you will be authenticated into your account. If you don't type the token and submit it before the token expires your authentication would fail and you would need to enter the new token.

## How Secure is 2FA?

Like any security mechanism there are ways that it can be hacked/compromised, however with two layers of authentication we are making it much harder for any hacker to gain access to our accounts, most people use the same password across multiple websites, with this method if someone does get that password but doesn't have the 2FA Token then they aren't getting into your accounts.

Not all deployments of 2FA are as secure as others, this comes down to the algorithms that are used and the reliance on any 3rd party servers to generate the 2FA Tokens. The type of 2FA used would really depend on the application and users that would be using it. Hardware based 2FA is much more secure than software based but relies on 3rd party hardware.

## Conclusion

Personally I believe that 2FA should be used where possible, if you have a smartphone that can install one of the 2FA applications I see no reason to avoid this.
It makes your accounts and personal information more secure and most importantly harder to hack!
