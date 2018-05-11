---
title: "Markdown Common Elements"
layout: post
date: 2016-02-24 22:44
image: /assets/images/markdown.jpg
headerImage: false
tag:
- markdown
- elements
star: false
category: blog
author: scottcohn
description: Markdown summary with different options
---

## Summary:

You can pick as item to see how to apply in markdown.

### Comum Elements
- [Basic formatting](#basic-formatting)
- [Headings](#headings)
- [Lists](#lists)
- [Paragraph Modifiers](#paragraph-modifiers)
- [Urls](#urls)
- [Horizontal Rule](#horizontal-rule)
- [Images](#images)
- [Code](#code)

---

## Basic formatting

This note **demonstrates** some of what [Markdown][1] is *capable of doing*.

And that's how to do it.

{% highlight html %}
This note **demonstrates** some of what [Markdown][some/link] is *capable of doing*.
{% endhighlight %}

---

## Headings

There are six levels of headings. They correspond with the six levels of HTML headings. You've probably noticed them already in the page. Each level down uses one more hash character. But we are using just 4 of them.

# Headings can be small

## Headings can be small

### Headings can be small

#### Headings can be small

{% highlight raw %}
# Heading
## Heading
### Heading
#### Heading
{% endhighlight %}

---

## Lists

### Ordered list

1. Item 1
2. A second item
3. Number 3

{% highlight raw %}
1. Item 1
2. A second item
3. Number 3
{% endhighlight %}

### Unordered list

* An item
* Another item
* Yet another item
* And there's more...

{% highlight raw %}
* An item
* Another item
* Yet another item
* And there's more...
{% endhighlight %}

---

## Paragraph modifiers

### Quote

> Here is a quote. What this is should be self explanatory. Quotes are automatically indented when they are used.

{% highlight raw %}
> Here is a quote. What this is should be self explanatory.
{% endhighlight raw %}

---

## URLs

URLs can be made in a handful of ways:

* A named link to [Mark It Down][3].
* Another named link to [Mark It Down](http://markitdown.net/)
* Sometimes you just want a URL like <http://markitdown.net/>.

{% highlight raw %}
* A named link to [MarkItDown][3].
* Another named link to [MarkItDown](http://markitdown.net/)
* Sometimes you just want a URL like <http://markitdown.net/>.
{% endhighlight %}

---

## Horizontal rule

A horizontal rule is a line that goes across the middle of the page.
It's sometimes handy for breaking things up.

{% highlight raw %}
---
{% endhighlight %}

---

## Images

Markdown can also contain images. I'll need to add something here sometime.

{% highlight raw %}
![Markdowm Image][/image/url]
{% endhighlight %}

![Markdowm Image][6]

*Figure Caption*?

{% highlight raw %}
![Markdowm Image][/image/url]
<figcaption class="caption">Photo by John Doe</figcaption>
{% endhighlight %}

![Markdowm Image][6]
<figcaption class="caption">Photo by John Doe</figcaption>

*Bigger Images*?

{% highlight raw %}
![Markdowm Image][/image/url]{: class="bigger-image" }
{% endhighlight %}

![Markdowm Image][6]{: class="bigger-image" }

---

## Code

A HTML Example:

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <h1>Just a test</h1>
</body>
</html>
{% endhighlight %}

A CSS Example:

{% highlight css %}
pre {
    padding: 10px;
    font-size: .8em;
    white-space: pre;
}

pre, table {
    width: 100%;
}

code, pre, tt {
    font-family: Monaco, Consolas, Inconsolata, monospace, sans-serif;
    background: rgba(0,0,0,.05);
}
{% endhighlight %}

A JS Example:

{% highlight js %}
// Sticky Header
$(window).scroll(function() {

    if ($(window).scrollTop() > 900 && !$("body").hasClass('show-menu')) {
        $('#hamburguer__open').fadeOut('fast');
    } else if (!$("body").hasClass('show-menu')) {
        $('#hamburguer__open').fadeIn('fast');
    }

});
{% endhighlight %}

[1]: http://daringfireball.net/projects/markdown/
[2]: http://www.fileformat.info/info/unicode/char/2163/index.htm
[3]: http://www.markitdown.net/
[4]: http://daringfireball.net/projects/markdown/basics
[5]: http://daringfireball.net/projects/markdown/syntax
[6]: http://kune.fr/wp-content/uploads/2013/10/ghost-blog.jpg

## Summary:

You can pick as item to see how to apply in markdown.

#### Especial Elements
- [Evidence](#evidence)
- [Side-by-Side](#side-by-side)
- [Star](#star)
- [Especial Breaker](#especial-breaker)
- [Spoiler](#spoiler)

#### External Elements
- [Gist](#gist)
- [Codepen](#codepen)
- [Slideshare](#slideshare)
- [Videos](#videos)

---

## Evidence

You can try the evidence!

<span class="evidence">Paragraphs can be written like so. A paragraph is the basic block of Markdown. A paragraph is what text will turn into when there is no reason it should become anything else.</span>

{% highlight html %}
<span class="evidence">Paragraphs can be written like so. A paragraph is the basic block of Markdown. A paragraph is what text will turn into when there is no reason it should become anything else.</span>
{% endhighlight %}

---

## Side-by-side

Like the [Medium](https://medium.com/) component.

**Image** on the left and **Text** on the right:

{% highlight html %}
<div class="side-by-side">
    <div class="toleft">
        <img class="image" src="{{ site.url }}/{{ site.picture }}" alt="Alt Text">
        <figcaption class="caption">Photo by John Doe</figcaption>
    </div>

    <div class="toright">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
</div>
{% endhighlight %}

<div class="side-by-side">
    <div class="toleft">
        <img class="image" src="{{ site.url }}/{{ site.picture }}" alt="Alt Text">
        <figcaption class="caption">Photo by John Doe</figcaption>
    </div>

    <div class="toright">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
</div>

**Text** on the left and **Image** on the right:

{% highlight html %}
<div class="side-by-side">
    <div class="toleft">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>

    <div class="toright">
        <img class="image" src="{{ site.url }}/{{ site.picture }}" alt="Alt Text">
        <figcaption class="caption">Photo by John Doe</figcaption>
    </div>
</div>
{% endhighlight %}

<div class="side-by-side">
    <div class="toleft">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>

    <div class="toright">
        <img class="image" src="{{ site.url }}/{{ site.picture }}" alt="Alt Text">
        <figcaption class="caption">Photo by John Doe</figcaption>
    </div>
</div>

---

## Star

You can give evidence to a post. Just add the tag to the markdown file.

{% highlight raw %}
star: true
{% endhighlight %}

---

## Especial Breaker

You can add a especial *hr* to your text.

{% highlight html %}
<div class="breaker"></div>
{% endhighlight %}

<div class="breaker"></div>

---

## Spoiler

You can add an especial hidden content that appears on hover.

{% highlight html %}
<div class="spoiler"><p>your content</p></div>
{% endhighlight %}

<div class="spoiler"><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p></div>

---

## Gist

You can add Gists from github.

{% highlight raw %}
{ % gist sergiokopplin/91ff4220480727b47224245ee2e9c291 % }
{% endhighlight %}

{% gist sergiokopplin/91ff4220480727b47224245ee2e9c291 %}

---

## Codepen

You can add Pens from Codepen.

{% highlight html %}
<p data-height="268" data-theme-id="0" data-slug-hash="gfdDu" data-default-tab="result" data-user="chriscoyier" class='codepen'>
    See the Pen <a href='http://codepen.io/chriscoyier/pen/gfdDu/'>Crappy Recreation of the Book Cover of *The Flame Alphabet*</a> by Chris Coyier (<a href='http://codepen.io/chriscoyier'>@chriscoyier</a>) on <a href='http://codepen.io'>CodePen</a>.
</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
{% endhighlight %}

<p data-height="268" data-theme-id="0" data-slug-hash="gfdDu" data-default-tab="result" data-user="chriscoyier" class='codepen'>See the Pen <a href='http://codepen.io/chriscoyier/pen/gfdDu/'>Crappy Recreation of the Book Cover of *The Flame Alphabet*</a> by Chris Coyier (<a href='http://codepen.io/chriscoyier'>@chriscoyier</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

---

## Slideshare

Add your presentations here!

{% highlight html %}
<iframe src="//www.slideshare.net/slideshow/embed_code/key/hqDhSJoWkrHe7l" width="560" height="310" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>
{% endhighlight %}

<iframe src="//www.slideshare.net/slideshow/embed_code/key/hqDhSJoWkrHe7l" width="560" height="310" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>

---

## Videos

Do you want some videos? Youtube, Vimeo or Vevo? Copy the embed code and paste on your post!

**Example**

{% highlight html %}
<iframe width="560" height="310" src="https://www.youtube.com/embed/r7XhWUDj-Ts" frameborder="0" allowfullscreen></iframe>
{% endhighlight %}

<iframe width="560" height="310" src="https://www.youtube.com/embed/r7XhWUDj-Ts" frameborder="0" allowfullscreen></iframe>

[1]: http://daringfireball.net/projects/markdown/
[2]: http://www.fileformat.info/info/unicode/char/2163/index.htm
[3]: http://www.markitdown.net/
[4]: http://daringfireball.net/projects/markdown/basics
[5]: http://daringfireball.net/projects/markdown/syntax
[6]: http://kune.fr/wp-content/uploads/2013/10/ghost-blog.jpg
