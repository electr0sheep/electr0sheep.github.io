---
layout: post
title: Another look at hashes
category: cryptography
---

After having looked over my [salt post](https://electr0sheep.com/cryptography/2016/11/22/salt/),
I've realized that I need to re-evaluate my knowledge in this sector, as it
appears that much of what I said was straight up wrong. But that's okay, we all
have to be retarded every once in a while, right? And honestly, in a couple years'
time, I'll probably look back at this and be astounded. Anyway, let's take another
look at this. We'll first look at some basic properties of cryptographic hash
functions, and then figure out how it applies to password storage.

# Basic properties of hashing algorithms
There are [3 major properties](https://en.wikipedia.org/wiki/Cryptographic_hash_function#Properties):
* Pre-image resistance
* Second pre-image resistance
* Collision resistance

## Pre-image resistance
> Given a hash value *h* it should be difficult to find any message *m* such
> that *h* = hash(*m*).

In plain-speak, this translates to:
> If I give you a hash of my password, it should be hard for you to figure out
> what my password is.

## Second pre-image resistance
> Given an input *m*<sub>1</sub> it should be difficult to find different input
> *m*<sub>2</sub> such that hash(*m*<sub>1</sub>) = hash(*m*<sub>2</sub>).

In plain-speak, this translates to:
> If I give you my password, it should be difficult for you to create a
> different password with exactly the same hash.

## Collision resistance
> It should be difficult to find two different messages *m*<sub>1</sub> and *m*
> <sub>2</sub> such that hash(*m*<sub>1</sub>) = hash(*m*<sub>2</sub>).

In plain-speak, this translates to:
> It should be difficult for you to find two passwords with the same hash.

### Birthday paradox/attack
The birthday paradox, simply stated is this: Given a room full of people, what
are the odds that two of them share the same birthday? Let's say there are 367
people in the room. What about 70 people? 23 people? The answers may surprise
you. For a room full of 367 people, the answer is obviously 100%, there are only
366 possible birthdays, and you have 367 people, so no surprises there. What you
may find more surprising is that for 70 people the probability of finding two
people with identical birthdays is an *astounding 99.9%*. For a measly 23 people
the odds are 50%.

The relationship between this and finding hash collisions
should be obvious.

You can find the exact details regarding this problem over at [Wikipedia](https://en.wikipedia.org/wiki/Birthday_problem),
but just for the sake of those who are interested, if you have a set with a
cardinality of *x*, then after you have examined 1.2 * sqrt(*x*), the odds of
you finding a duplicate element are approximately 50%.

## Difference between second pre-image resistance and collision resistance
At first glance, they appear to be the same. However, there is a key difference.
Let's apply the birthday paradox to find out what it is, but let's change up
the wording a bit. Instead of *what are the odds of finding two people with the
same birthday?*, let's change it to *what are the odds of finding a person with
a birthday on January 5th?*. What you'll find is that the odds are never 100%,
no matter how many people you crowd into the room. And thus we see that this is
a fundamentally different problem.

It is important to note, that collision resistance is not an important factor
when discussing password hashing. You are looking for a *specific* hash, not
just any two arbitrary hashes.

## Other important properties
Let's take a look at the [Argon2 hashing algorithm](https://en.wikipedia.org/wiki/Argon2).
We'll see that you can configure three properties
* Execution time
* Memory required
* Degree of parallelism
Now, why in the world are these things so important? (And boy, I sure hope I
know what the heck I'm talking about here). You may want to take this with a
grain of salt, no pun intended.

### Execution time
Somewhat ironically, cryptographically secure hashing algorithms need to be
*slow*. This is to increase the workload that an attacker will have when they
try to brute force your hashes.

### Memory required
Now this one may cause you to scratch your head. What the devil would memory
have anything to do with hash security? Well, GPUs are what you'll be using if
you are an amateur hash cracker. GPUs have limited memory available, and so, by
requiring enough memory, you will force an attacker to use other methods, like
an FPGA to crack your hash. Require enough memory, and you'll make an FPGA
brute force infeasible as well.

### Degree of parallelism
The more parallelizable something is, the more attempts you can make per second.

## Workload/security tradeoff
You need to be aware that if you are hosting a web service, there will *always*
be a workload/security tradeoff. Let's say you want a hashing algorithm to take
one minute to complete. This means that your hashes will *never* be brute forced.
Your hashes are as secure as a spec of gold dust in Fort Knox. If an attacker
somehow gets a dump of your database, they'll throw away the password hashes and
move on. What this also means, is that you have effectively DDoSed yourself. For
one, it will take a user one minute to be logged in. For another, after you have
100 people trying to log in, your server won't be able to handle it, and the
unfortunate soul who was 100th to log in will have to wait *forever* to log in.
So, in practice, you want your hashing algorithm to take as long as it can,
without negatively impacting your users, and also without DDoSing yourself.
