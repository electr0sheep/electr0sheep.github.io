---
layout: post
title: How to add ssh keys permanently in macOS Sierra
category: osx
---

This post assumes you are familiar with basic macOS ssh structure.

The process is very simple. Let's assume that you have an ssh key called id_rsa.
Go to your .ssh folder. Open the config file (or create it if you don't have one).
Add the following to the top:

```
Host *
  UseKeychain yes
  AddKeysToAgent yes
  IdentityFile ~/.ssh/id_rsa
  IdentityFile <PATH_TO_MORE_KEYS>
```

Then, from the terminal run

```
ssh-add -K ~/.ssh/id_rsa
```

Now, when you reset your machine you won't have to manually ssh-add every time.
