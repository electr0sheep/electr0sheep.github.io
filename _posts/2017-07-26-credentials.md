---
layout: post
title: So you want to protect user credentials?
category: cryptography
---

This one's going to be short.

I've been kind of puzzled about how I can best protect user credentials for some
time now. I know I should hash my passwords and I know I should salt them. But,
how/what do I salt? What hashing algorithm should I use? Well, I've come across
a freakin' treasure trove of information regarding this today, and so here are
some links.

[Password Storage Cheat Sheet](https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet#Use_a_cryptographically_strong_credential-specific_salt)  
*Has a lot of relevant information regarding some credential storing basics*  
[How does Dropbox store credentials?](https://blogs.dropbox.com/tech/2016/09/how-dropbox-securely-stores-your-passwords/)  
*Dropbox is probably pretty flipping secure nowadays. Here's how they do security.*  
[Passwords for a modern era](https://www.troyhunt.com/passwords-evolved-authentication-guidance-for-the-modern-era/)  
*Has some GREAT password best-practices advice. I was so excited about this I was
probably about half a centimeter away from pooping myself*  

TL;DR:  
Use the [Argon2 hashing algorithm](https://en.wikipedia.org/wiki/Argon2)
Use a different salt for each user. The salt DOES NOT need to be hidden. You can
store it as part of the password, or in a different database entry. Make the salt
at least 32 bytes in length.
