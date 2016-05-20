---
layout: post
title: Git Pages doesn't support plugins???
category: random
---

So last night, I wrote my Warcraft post and everything was peachy...until I uploaded to git. I found that nothing I pushed was being updated! Long story short, turns out, git doesn't support ruby plugins! And I put so much effort into them as well! Well, actually no I didn't. I snagged a youtube embedder script from off the jekyll site. Interestingly, whoever wrote it didn't do it right.

Here's the youtube bit:
{% highlight ruby %}
class YouTube < Liquid::Tag
	Syntax = /^\s*([^\s]+)(\s+(\d+)\s+(\d+)\s*)?/

	def initialize(tagName, markup, tokens)
		super

		if markup =~ Syntax then
			@id = $1

			if $2.nil? then
				@width = 560
				@height = 420
			else
				@width = $3.to_i
				@height = $4.to_i
			end
		else
			raise "No YouTube ID provided in the \"youtube\" tag"
		end
	end

	def render(context)
		"<iframe width=\"#{@width}\" height=\"#{@height}\" src=\"https://www.youtube.com/embed/M7g90VvETiU?theme=light&showinfo=0\" frameborder=\"0\"></iframe>"
	end

	Liquid::Template.register_tag "youtube", self
end
{% endhighlight %}

The way that you would call this in your .md document is like this:
{% raw %}
	{% youtube http://www.youtube.com/Rasdf325#@/ 100 200 %}
{% endraw %}
This would insert an embedded youtube video of size 100x200
Interestingly, the variable $2 in this case, would be 100 200
$3 is 100 and $4 is 200
The author of the original youtube script simply checked if $2 was empty, and if not assigned $2 to width and $3 to height. Perhaps this isn't the case for everyone, but from what I tested this was incorrect.

Here's the image bit I did based off the youtube bit:
{% highlight ruby%}
class Image < Liquid::Tag
	Syntax = /^\s*([^\s]+)(\s+(\d+)\s+(\d+)\s*)?/

	def initialize(tagName, markup, tokens)
		super

		if markup =~ Syntax then
			@name = $1

			if $2.nil? then
				@width = 640
				@height = 480
			elsif $3.nil? then
				@width = $3
				@height = 480
			else
				@width = $3
				@height = $4
			end
		else
			raise "There is some error with the image"
		end
	end

	def render(context)
		"<img src=\"#{@name}\" alt=\"Unable to load image: #{@name}\" style=\"width:#{@width}px;height:#{@height}px\"/>"
	end

	Liquid::Template.register_tag "image", self
end
{% endhighlight %}

###Pretty rad right?

##NO!!!

Turns out, git can't use any of this. In fact, if you put these two .rb files in a plugins folder, git will go full retard and just ignore everything you submit. Like...you can check your repo and everything will be in there, but it just doesn't care. This was a touch frustrating for me, but luckily, my GitStar bro figured it out for me (^_^)
