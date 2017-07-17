---
layout: post
title: Set up Kali Linux on a thumb drive for MacBooks
category: cryptography
---

Greetings! With practically no introduction whatsoever, let's dive directly into
getting this up and running!

This guide has 4 parts

1- Setting up Kali on a thumb drive
2- Setting up encrypted persistence mode
3- Installing the wifi driver for MacBooks
4- Setting up an actual user account and disabling the root user
5- Optional fun stuff

# Setting up Kali on a thumb drive
First things first, you're gonna need a Kali ISO file. So, go ahead and [grab the
latest version](https://www.kali.org/downloads/), or [use the version I used](http://cdimage.kali.org/kali-2017.1/kali-linux-2017.1-amd64.iso).

Now, you're going to need to make a bootable USB drive out of that ISO. I used
[Rufus](https://rufus.akeo.ie/), which is what the folks over at Ubuntu
recommend, and I think it works great. I beleive Rufus is Windows-only, so feel
free to use what method you like to do this step.

One thing to note, is that the default username for Kali is `root` and the
default password is `toor`, root backwards.

Once you are finished with these instructions, you should be able to boot from
the thumb drive into Kali. If not, something isn't right.

# Setting up encrypted persistence mode
First off, persistence mode enables Kali to keep files. Without it, every time
you boot Kali, it will be as though the OS has never been run before, which can
be a hassle, as we'll find out in the next section.

So, boot into Kali using your bootable thumb drive. You may notice in the boot
menu two persistence options. Those will not work without first setting up a
partition on the thumb drive, so simply selecting those options will accomplish
nothing. As such, it doesn't matter which option you choose, so long
as you are booted into Kali, because every option is the same for what we are
about to do.

Once you have Kali up, fire up a terminal. From here on, every time you see a
code block

    Like this

, that will indicate things you need to type in the terminal. Once you have the
terminal open, type

    fdisk -l

which will display a list of drives connected to your computer. Identify which
one is your thumb drive. In the event that you only have a single drive besides
the thumb drive connected to your computer (i.e. the hard disk your primary
OS boots from), this will most likely be /dev/sdb. fdisk will also show numbers
after sda, sdb, sdc, and so on, and those numbers indicate partitions on that
drive, which we don't care about for now. All we want is to find which letter
after "sd" identifies our thumb drive.

Did you find it? Good, let's continue

We'll use parted to create another partition on our thumb drive.

    parted /dev/sdb

Now we should see (parted) instead of root@kali:

    print free

will show us detailed information about the partitions on our thumb drive. What
we are looking for is where the last partition ends, and the end of our thumb
drive, which should be displayed for us now.

So, noting these two details, we are ready to create our partition. For me, the
last partition ended at 2794MB and the end of my thumb drive was 15.8GB.

    mkpart primary 2794MB 15.8GB

Now, we are done with parted. To close a running program in a terminal in unix,
use ctrl+c (do that now to end parted). We can use fdisk -l to verify that the
new partition was created, but it's just to make you feel warm and bubbly inside.

Now we need to create a file system for our partition. Even better, our partition
will be encrypted, because we're using Kali linux and the thought of our
colleagues pwning us reminds us of the time we were laughed off the stage in the
Shrek middle school musical. This next command assumes that sdb was the thumb
drive and we just made a third partition for it.

    cryptsetup --verbose --verify-passphrase luksFormat /dev/sdb3

This will prompt us for a password. You will use this password EVERY time you
boot Kali, so be prepared for that. This next one will give us access to the
partition so we can create a file system for it.

    cryptsetup luksOpen /dev/sdb3 my_usb

Okay, now let's make the filesystem

    mkfs.ext3 -L persistence /dev/mapper/my_usb

And then

    e2label /dev/mapper/my_usb persistence

Finally, we need to make a conf file, so we'll use four commands for that

    mkdir -p /mnt/my_usb
    mount /dev/mapper/my_usb /mnt/my_usb
    echo "/ union" > /mnt/my_usb/persistence.conf
    umount /dev/mapper/my_usb

Now, let's close the encrypted channel to our persistence partition

    cryptsetup luksClose /dev/mapper/my_usb

Okay, so now when we boot into Kali, we should be able to pick up where we left
off. All our programs that we install from here on should still be there. Bash
history will be there, etc.

So, to test, shut down Kali and reboot into the thumb drive. This time, be sure
to select "Live USB encrypted Persistence" from the boot menu. During the boot
process, you should see the following prompt: "Please unlock disk /dev/sdb3:",
at which point you enter your password when we set made the partition. NOTE:
NOT TOOR

# Installing the wifi driver for MacBooks
Okay, so now we're getting into some juicy stuff here. The reason we desire
persistence is so we don't have to keep setting up all our drivers and crap like
that. I use Kali from a MacBook Air (Early 2014), and the wifi adapter will not
work right off the bat. This can be killer, but I used an ethernet to usb dongle
I got from Amazon for internet initially. You can also install these drivers
without internet from another thumb drive, but that's not what I did, and I
don't know how to do it. Assuming you've got internet somehow, it's not too hard
to set up the adapter, but one of the commands is straight gibberish. Fire up
the old terminal and let's get going.

    apt-get install linux-headers-$(uname -r | sed 's,[^-]*-[^-]*-..') broadcom-sta-dkms

That's the part you need internet for. It's important to note that you should
see

wl:
Running module version sanity check.

towards the top part of your terminal window. If not, something went wrong. Now,
we need to disable crap drivers and enable the good one.

    modprobe -r b44 b43 b43legacy ssb brcmsmac

And then

    modprobe wl

Type

    iwconfig

and now you should see an entry for wlan0. But an even easier way to verify that
everything went well is that you'll be able to set up a wifi connection in Kali
now :)

# Setting up an actual user account and disabling the root user
Okay, so now let's not use the root user to log in. First, we'll create a user
profile. We don't need to use the terminal for this part! Click the down arrow
at the top-right corner of the screen, click root, and then click account
settings. Click the Add User... button.

MAKE SURE YOU ARE MAKING YOURSELF AN ADMINISTRATOR, because we're going to be
disabling root. Type your username in the Full Name and Username fields (the
full name part doesn't matter at all, really), and then give yourself a password.
NOTE: BE SURE YOU MADE YOURSELF AN ADMINISTRATOR

When you're done, click Add. Now you have another user. However, you'll soon
realize (if you don't follow the next instructions) that Kali couldn't care less
about this new user. It automatically logs you in on boot, and if you log out of
root, it just kills the desktop environment. So, we need to change a file. I use
the VIM file editor, but leafpad is more user-friendly.

    leafpad /etc/gdm3/daemon.conf

Now, with the leafpad editor open, comment out the following lines by adding a
"#" at the beginning of the line.

AutomaticLoginEnable=true
AutomaticLogin=root
TimedLoginEnable=true
TimedLogin=root
TimedLoginDelay=5
AllowRoot = true

Make sure you save your changes.

Note: If you didn't give yourself admin rights, you won't be able to access
anything that requires these privileges at all anymore, which pretty much means
you need to restart everything from the very beginning.

Now, I recommend restarting the machine and rebooting into Kali at this point.

You'll know you did these instructions correctly if:

Kali makes you login at boot.
You can log out without killing the desktop environment
You can use Google Chrome (assuming you install it, which we'll discuss in the
next section)

# Optional fun stuff

## Install Google Chrome
Let's install everyone's favorite web browser! Though Firefox ESR and Firefox
Development edition will probably be more useful to someone using Kali, it's
always good to have Chrome!

Download the Debian/Ubuntu version of Chrome. Once you have it, the big question
is, how do you use a .deb file?

    dpkg -i PATH_TO_SOME_.DEB_FILE

If you do this without creating a non-root user, Chrome will whine and complain.
You can use Chrome as root, and odds are you won't run into trouble. The concern
is, if someone hijacks your Chrome browser, they have access to the root user.
You may think there is no difference between root and another user with admin
privileges, but you'd be 100% wrong.

## Update packages
Now, if you update your packages, it will actually retain the updates when you
restart the machine. I'm not going to walk you through this process. Do it,
don't do it, it's up to you! NOTE: sudo apt-get upgrade WILL TAKE A LONG TIME!!

    sudo apt-get update
    sudo apt-get upgrade

# Sources
I got my instructions for this primarily from the following sources:

https://docs.kali.org/downloading/kali-linux-live-usb-persistence
https://unix.stackexchange.com/questions/234859/how-to-create-a-partition-in-free-space-using-gnu-parted
https://pentestmac.wordpress.com/2015/11/28/kali-linux-broadcom-wireless-on-macbook/
http://www.binarytides.com/auto-login-root-user-kali/

# Updates
I plan on updating this as soon as I confirm that you can set the wifi adapter
to monitor mode, a critical component of using some of Kali's tools.