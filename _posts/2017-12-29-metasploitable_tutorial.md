---
layout: post
title: Metasploitable Tutorial
category: cryptography
---

This tutorial assumes you have a metasploitable virtual machine installed
correctly (with network ports visible) and that you will be using Kali Linux to
assess vulnerabilities.

This post is a WIP, but I will link several resources you can use while I figure
out what I am doing myself.

There are some great Metasploit/Metasploitable tutorials [here](http://www.hackingtutorials.org/metasploit-tutorials/).  
There are also some good tutorials on using some of Kali's many tools [here](https://null-byte.wonderhowto.com/how-to/).  
Offensive Security, the folks who brought you Kali Linux also have some free
tutorials [here](https://www.offensive-security.com/metasploit-unleashed/).  

Furthermore, I have posted links to the pdfs of my cybersecurity class labs.


| File                            | Description                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------- |
| [Lab 1](/public/files/LAB1.pdf) | *An introduction to the different modes of operation used by symmetric ciphers*   |
| [Lab 2](/public/files/LAB2.pdf) | *An introduction to WPA passphrase cracking*                                      |
| [Lab 3](/public/files/LAB3.pdf) | *An introduction to asymmetric ciphers and how they compare to symmetric ciphers* |
| [Lab 4](/public/files/LAB4.pdf) | *An introduction to certificate authorities*                                      |
| [Lab 5](/public/files/LAB5.pdf) | *An introduction to SSL strip attacks*                                            |

# Installing Metasploitable 3
I wanted to do a quick write-up on how to install this, since you have to build
it yourself. I built it on a Windows 10 machine, but I wouldn't anticipate huge
differences between Windows and Linux/OSX. To install it, you will need to use
Docker and Vagrant.

## Anti-Virus Warning
Metasploitable contains some shady stuff, so there is a good chance your
anti-virus will try to delete some files. If it does, your install will get
screwed up, so disable it if you have to.

## Metasploitable 3
You will need the Metasploitable code, naturally. You can find it in [this GitHub repo](https://github.com/rapid7/metasploitable3)
Click clone or download, then download zip.

Extract the zip to some folder (I extracted it to a folder called Metasploitable,
  and I'll assume you did the same thing)

## Docker
So this may not be as straightforward as you expect. Initially, I tried the
latest version of Docker, but the install script failed. I found that people
recommended Docker 1.1.1, but then the question is, how to get it? There
probably is an easier way than what I used, but I'll outline my process anyway.

I used a package manager for windows called [Chocolatey](https://chocolatey.org/)
You can install it by pasting the following into Command Prompt `@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
`

Once that is installed, you can install the correct version of Docker by pasting
the following into Command Prompt `choco install packer --version 1.1.1`

That's great and all, but the next question is, where did it get installed to?
You can check your environment variables for ChocolateyInstall, but for me, the
install directory is C:\ProgramData\chocolatey

Once you've found the install directory, you can find the .exe file you are
looking for in lib\packer\tools\packer.exe   So, the full path would be
C:\ProgramData\chocolatey\lib\packer\tools\packer.exe

Once you've found it, copy it to the directory that contains Metasploitable (Again,
  assuming you named your extraction folder the same as me, that would be Metasploitable\metasploitable3-master)

Once that's done, congrats, you're done with Docker

## Vagrant
Vagrant is a bit easier. You can download the version you are looking for [at this link](https://releases.hashicorp.com/vagrant/1.9.1/)
If you are using Windows, like me, you obviously need the .msi file, otherwise,
pick what you need. Once you've got it, install it.

With Vagrant installed, you need to install two plugins. The first plugin can be
downloaded [here](https://github.com/aidanns/vagrant-reload/archive/v0.0.1.zip).
Extract the zip file, and then navigate to that directory in Command Prompt and
execute this `vagrant plugin install vagrant-reload`

Once that install the next plugin by executing this in Command Prompt `vagrant plugin install vagrant-vbguest`

With Vagrant and those two plugins installed, you should be ready to go

## Building Metasploitable3

Open a PowerShell window, and run these commnands  
`Get-ExecutionPolicy`  
Take note of what it currently is, so you can change it back (in my case: restricted)
`Set-ExecutionPolicy unrestricted`  
We're setting the permissions here wide open so we can execute the install
script. Once that's done, navigate to the Metasploitable\metasploitable3-master
directory
`.\build_win2008.ps1`

This will download Windows Server 2008 (yep, that's why you can't just download
an iso or a virtual machine image), and set the virtual machine up, which includes
several restarts, so it will take a while (like probably an hour).

After that is done, you may need to do some hackery. I was using the latest
version of VirtualBox (5.2.4), which wasn't supported by the version of Vagrant
we are using (1.9.1). Fortunately, it is relatively easy to add support. You can
find what you need to do [here](https://github.com/hashicorp/vagrant/issues/9090),
but I'll cover that same process here as well.

Navigate to the directory C:\HashiCorp\Vagrant\embedded\gems\gems\vagrant-1.9.1\plugins\providers\virtualbox
Once there, we need to edit the plugin.rb file. I first tried this with Notepad,
but Notepad didn't quite work right (I think this is because Windows, Linux, and
Macs all use different techniques for new lines). So, after failing with Notepad,
I used [Atom](https://atom.io/). At any rate, when you get the file open, it
shouldn't be just one giant mess of a line, it should be neatly organized into
code blocks. Add the following after line 59: `autoload :Version_5_2, File.expand_path("../driver/version_5_2", __FILE__)`

Next, go to the driver folder, and add the following after line 64 of the meta.rb
file: `"5.2" => Version_5_2,`

Finally copy the file version_5_1.rb and rename the copied file version_5_2.rb.
Open the copied file and change the two occurences of `_5_1` to `_5_2`

With that hackery out of the way, you should be able to execute `vagrant up`
from PowerShell without error.

After that is done, I still ran into some weird VirtualBox error, but it seemed
to go away after I restarted VirtualBox or something.

<!-- <script>
var remote_ip = prompt("Please enter Metasploitable's IP address");
var host_ip = prompt("Please enter your IP address");
document.getElementById('remote_ip_addr').innerHTML = remote_ip;
document.getElementById('host_ip_addr').innerHTML = host_ip;
</script> -->
