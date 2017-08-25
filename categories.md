---
layout: page
title: Categories
permalink: /category/random/
---

<ol class="post_list posts">
{% for category in site.categories %}
  <li>
    <a href="{{ category.url }}">{{ category.title }}</a>
  </li>
{% endfor %}
</ol>

<!-- {% for category in site.categories %}
    {% capture category_slug %}{{ category | first }}{% endcapture %}
    {% for c_slug in category_slug %}
        {% if c_slug == page.categories %}
            <button class="btn btn-sm btn-default active">{{ c_slug }}</button>
        {% else %}
            <a href="/category/{{ c_slug }}" class="btn btn-sm btn-default">{{ c_slug }}</a>
        {% endif %}
    {% endfor %}
{% endfor %} -->
