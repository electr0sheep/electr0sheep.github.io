---
layout: post
title: Understanding the softmax algorithm
category: ai
---

So I am learning about machine learning. One of the excercises I did was
essentially run the softmax algorithm on a list of values to compute the
respective probability of each. It took a little bit of time, but I eventually
found a python example and reverse-understood it. I am going to give a list of
numbers and show how to run the softmax on them.

Take the set [3.0, 1.0, 0.2]. To compute the softmax values, first find e^(x),
where x is each element in the set.

e^(3.0)=20.08553692  
e^(1.0)=2.718281828  
e^(0.2)=1.221402758  

These numbers are approximate, of course. Let's put these new numbers in another
set [20.08553692, 2.718281828, 1.221402758]

Now, to find the softmax values for each, simply divide each element by the sum
of elements in the set

20.08553692 / 24.02522151 = 0.836018803  
2.718281828 / 24.02522151 = 0.113142841  
1.221402758 / 24.02522151 = 0.050838356  

To test, one can add up the softmax values and make sure they add up to be 1

0.836018803 + 0.113142841 + 0.050838356 = 1
