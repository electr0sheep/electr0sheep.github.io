---
layout: page
title: Categories
permalink: /categories/
---

<ol class="post_list posts">
{% for category in paginator.categories %}
  <li>
    <a href="{{ category.url }}">{{ category.title }}</a>
  </li>
{% endfor %}
</ol>
