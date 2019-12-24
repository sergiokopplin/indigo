---
layout: page
title: Tags
---
<section class="list">
    <h1 class="title">Tags</h1>

    {% assign tags_list = site.tags %}

    {% if tags_list.first[0] == null %}
        {% for tag in tags_list %}
            <a class="item" href="#{{ tag | slugify }}">{{ tag }}</a>
        {% endfor %}
    {% else %}
        {% for tag in tags_list %}
            <a class="item" href="#{{ tag[0] | slugify }}">{{ tag[0] }}</a>
        {% endfor %}
    {% endif %}

    {% assign tags_list = nil %}
</section>

<hr>

<section class="tag-list">
    {% for tag in site.tags  %}
    <h2 class="title" id="{{ tag[0] | slugify }}">#{{ tag[0] }}</h2>

    <ul class="list">
        {% assign pages_list = tag[1] %}
        {% for post in pages_list reversed %}
            {% if post.title != null %}
                {% if group == null or group == post.group %}
                    <li class="item">
                        <a class="url" href="{{ site.url }}{{ post.url }}">
                            <aside class="date"><time datetime="{{ post.date | date:"%d-%m-%Y" }}">{{ post.date | date: "%b %d %Y" }}</time></aside>
                            <h3 class="title">{{ post.title }}</h3>
                        </a>
                    </li>
                {% endif %}
            {% endif %}
        {% endfor %}
        {% assign pages_list = nil %}
        {% assign group = nil %}
    </ul>

    <div class="breaker"></div>
    {% endfor %}
</section>
