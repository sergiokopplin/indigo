---
title: "Build a blog with GitHub - Part 2"
layout: post
date: 2016-02-29 10:00
tag: blog-setup
blog: true
draft: true
summary: "Part 2 of a step by step non-coder's guide to setting up a personal site on GitHub"
permalink: build-a-github-blog-part-2
---

Here's Part 1 of this post <http://artiannaswamy.com/build-a-github-blog-part-1>

We left off at the point where your site is live, but the theme inhabiting it doesn't have your information.

Let's fix that first, then try a few customizations.

## Index
- [1. Personalize your site](#personalize)
- [2. Add New Pages](#add-pages)
- [3. Set Custom URLs for Posts](#custom-urls)
- [4. Setup Hidden Drafts](#hidden-drafts)
- [5. Tags and Tag Indexes](#tags)

<div class="breaker"></div> <a id="personalize"></a>

## Personalize your site

With a GitHub theme, the first place you start is with the <span class="evidence">_config.yml</span> file.

The developer will have provided some documentation to go with the theme - read that first to see if there are any special quirks to the config file. Then open up the config file, and browse through the various variables.

This is the settings section or the control center of your site. Updates you make here will get reflected in multiple areas of the site, not necessarily just the home page. 

Let's go through some of the config settings in the [Indigo theme](http://koppl.in/indigo) I am using on my site.

Here, first, is the original _config.yml file from the source theme. Let's take each of these one at a time.

{% highlight raw %}
name: John Doe
bio: 'A Man who travels the world eating noodles'

# main text of home
picture: 'assets/images/profile.jpg'

url: http://sergiokopplin.github.io/indigo
# your url: http://USERNAME.github.io

permalink: /:title/

markdown: kramdown
highlighter: rouge

analytics-google: 'UA-MYANALYTICS'

# if you don't want comments in your posts, set to false
disqus: mydisqus

# if you don't have any of social below, comment the line
facebook: myfacebook
twitter: mytwitter
# google: mygoogle
# instagram: myinstagram
# pinterest: mypinterest
linkedin: mylinkedin
youtube: myyoutube
spotify: myspotify
github: mygithub
email: myemail@gmail.com

# if you don't need pagination, comment the *paginate* configs below
# paginate: 5
# paginate_path: "blog/:num/"

# if you don't need projects, comment the *projects* configs below
projects: true

# if you don't need "about" or "blog", comment them out below
about: true
blog: true

# do you want to show the "read time" of the posts?
read-time: true

# do you want to show the "tags" inside the posts?
show-tags: true

# related posts inside a post?
related: true

# do you want some animations?
animation: true

gems:
  - jemoji
  - jekyll-mentions
  - jekyll-seo-tag
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-gist
  - jekyll-paginate

jekyll-mentions:
    base_url: https://github.com

exclude: [README.md, Gemfile, Gemfile.lock, node_modules, gulpfile.js, package.json, _site, src, vendor, CNAME, indigo-gh-pages.zip, Rakefile, screen-shot.png, travis.sh]

{% endhighlight $%}

#### Name & Bio

{% highlight raw %}
name: John Doe
bio: 'A Man who travels the world eating noodles'
{% endhighlight %}

The first thing you want to change is, of course, the name and bio with your own name and a short description of who you are / what you do. Follow the syntax of the original file when updating with new information. That is, for example, replace John Doe with your name, but don't put it in quotes. However, in the Bio, the author has used single quotes on either side of the phrase, so you should do the same. 

#### Profile Picture

{% highlight raw %}
picture: 'assets/images/profile.jpg'
{% endhighlight %}

On your computer, browse to the GitHub directory you created for your site, browse to the assets > images folder, and find the profile.jpg file. Note the dimensions of the file, and create a file with your own picture (or whatever pleases you) with the same dimensions. Replace the profile.jpg file with your file.

#### URLs

{% highlight raw %}
url: http://sergiokopplin.github.io/indigo
# your url: http://USERNAME.github.io
{% endhighlight %}

If you were sticking with the *yourusername.github.io* naming for your website, you'd change this URL to the github.io address. But since you have your personal domain mapped to this, you want to change this field to **http://yourdomain.com**.

#### Google Analytics

You can leave the permalink, markdown and highlighter fields alone for now.

{% highlight raw %}
analytics-google: 'UA-MYANALYTICS'
{% endhighlight %}

With the Google Analytics field, this is definitely something you want to set up now so you can keep an eye on the stats of your site.

- Go to <https://www.google.com/analytics/> and sign in with your Gmail ID (or create one, if you don't have one).
- Go to the 'Admin' tab
- There should be three columns, with a dropdown at the top of each. In the first column, click the dropdown, and click 'Create New Account'
- Fill out the fields like so:

<div class="center"><img src="https://raw.githubusercontent.com/aannasw/aannasw.github.io/master/assets/images/posts/build-a-blog/google-analytics.png" /></div>

- Read through the data tracking section and check or uncheck each of the settings as you prefer. 
- Click 'Get Tracking ID'

<div class="center"><img src="https://raw.githubusercontent.com/aannasw/aannasw.github.io/master/assets/images/posts/build-a-blog/get-tracking-id.png" /></div>

- Google will create tracking ID for you that'll look something like 'UA-########'.
- Copy this tracking ID, return to your _config.yml and paste it in the analytics-google field.

#### Disqus

{% highlight raw %}
disqus: mydisqus
{% endhighlight %}

If you'd like to set up Disqus commenting on your blog:

- Go to Disqus.com and set up an account (need not match any name or URL you've used to set up this site).
- Once you have an account, go to Settings and click 'Add Disqus to Site'
- Click 'Start using Engage'
- Fill out the form, and make sure you note the shortname you use in setting up this account

<div class="center"><img src="https://raw.githubusercontent.com/aannasw/aannasw.github.io/master/assets/images/posts/build-a-blog/disqus.png" /></div>

- Return to your config file and paste this shortname in the disqus field.

#### Social Links

{% highlight raw %}
facebook: myfacebook
twitter: mytwitter
# google: mygoogle
# instagram: myinstagram
# pinterest: mypinterest
linkedin: mylinkedin
youtube: myyoutube
spotify: myspotify
github: mygithub
email: myemail@gmail.com
{% endhighlight %}

- Replace the 'myfacebook', 'mytwitter' dummy names with your actual IDs from each of the sites, and you're good to go!
- If you don't want a specific social link to show below your picture on the front page, put a '#' symbol in the front, which will 'comment out' the line and not run it as code.
