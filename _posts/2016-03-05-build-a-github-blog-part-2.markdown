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
- [5. Different headers for different pages](#different-headers)
- [6. Tags and Tag Indexes](#tags)


<div class="breaker"></div> <a id="personalize"></a>

## 1. Personalize your site

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

With the Google Analytics field, this is definitely something you want to set up now so you can keep an eye on the stats for your site.

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

- Go to the [Disqus](https://disqus.com) website and set up an account (need not match any name or URL you've used to set up this site).
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

- Replace the dummy names (myfacebook, mytwitter etc) with your actual IDs from each of the sites, and you're good to go.
- If you don't want a specific social link to show below your picture on the front page, put a '#' symbol in the front, which will comment out the line and not run it as code.

#### Blog features setup

{% highlight raw %}

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

{% endhighlight %}

The sections here are all self-explanatory. If you want to see exactly what they affect, turn off and on each of the features, and see what happens. 

To summarize the settings: 

- projects, about and blog pages turning off and on will remove the links from the front page and the navigation
- read time, tags and related posts affects extra info inside the posts itself
- animations will affect that initial dropping effect by the title and the social links when you launch the home page

<div class="breaker"></div> <a id="add-pages"></a>

## 2. Add New Pages

I liked the way this theme was organized, because I found it pretty intuitive to follow along on the various references to other files till I found the one I wanted to change. For example, if you start at index.html (Right Click > Open With ... TextWrangler), you'll see references to header.html and footer.html. If you open up header.html in the _includes folder, you will see the code that controls which pages the header applies to.

Here's that code in the original theme:

<script src="https://gist.github.com/aannasw/b69681d6520bbda0fe71.js"></script>

From that first line, it looks like the header defined in lines 3 - 14 will show only if the page title is Home or Blog or About.

Which means, if you add any new pages, it won't include the Header, unless you add a reference to that new page here. So, let's do that.

- Edit the first part of the snippet to:
{% highlight raw %}
if page.title == "Home" or page.title == "Blog" or page.title == "Projects" or page.title == "Consulting"
{% endhighlight %}

- Then, switch over to your GitHub directory, and find the About page and make a copy of it.
- Rename this copy to Consulting, and keep the file extension the same as the About page
- Open the newly renamed Consulting.md
- The part at the very top between the two triple-dashed lines is called the **YAML front matter** and will be processed first, and that's the key.
- Here's the YAML from the About page:
{% highlight raw %}
---
title: About
layout: page
permalink: /about/index.html
---
{% endhighlight %}

- Change that to:
{% highlight html %}
---
title: Consulting
layout: page
permalink: /consulting/index.html
---
{% endhighlight %}

- Next, head over to the nav.html file, and you'll see sections of code for each of the pages. Copy and paste the 'About' section, and change all the **about**s to **consulting**s.

<script src="https://gist.github.com/aannasw/4d50dff33c4ef8d26593.js"></script>

- That should do it for adding a new page. After you commit all the changes and sync, you should see a link to the new Consulting page on your site.

<div class="breaker"></div> <a id="custom-urls"></a>

## 3. Set Custom URLs for Posts

For this one, I refer you to another excellent post by Joshua Lande <http://joshualande.com/short-urls-jekyll/>. I followed this exactly, and it's worked great for me.

<div class="breaker"></div> <a id="hidden-drafts"></a>

## 4. Setup Hidden Drafts

This feature's something I'm still testing, and I may end up making edits to this section down the road. At this point, I set this up as described in this thread <https://gist.github.com/carlo/2870636>.

A few pros and cons on how this works out practically:

**Pros:**

- If you're using GitHub Desktop for your updates, you don't have the benefit of installing jekyll, ruby et all and building the site on your desktop and testing it locally (without publishing to the web). Implementing this introduces the missing draft feature.
- It publishes the post, but hides it from the Blog page list, so you can review the content and layout before officially publishing it

**Cons:**

- It does actually publish it online. Where that shows up, is in the RSS feed. I'm still looking for a way to exclude draft posts from the rss feed. 

[Jekyll Feed documentation](https://github.com/jekyll/jekyll-feed) seems to suggest this is already a feature, but only if it's implemented as a _drafts folder, which you will need to run some git code on to build and serve on your desktop. 

Here's how you include a drafts feature with the [Indigo theme](http://koppl.in/indigo) we are using.

- At this point, hopefully you haven't published too many blog posts. 
- Open up all the posts (not projects - you can tell by checking for projects: true or blog:true in the YAML front matter) in the _posts folder in your text editor, and 
- Add ````drafts: true```` or ````drafts: false```` to the header, depending on whether or not you want that post to show in the blog page. 
- Switch to your GitHub directory, browse to the _includes folder, and open up the ````blog-post.html```` file in your text editor
- Here's the original file:
<script src="https://gist.github.com/aannasw/b00ad0f31f4d4ad3a15a.js"></script>
- You want to change this as follows:
<script src="https://gist.github.com/aannasw/331c4386020437befa6f.js"></script>
- As you can tell, it adds a validation to the blog post page to check if the draft variable is set to false (i.e. it is not a draft, but a published post) before including it in the list.
- That's it. When you commit and sync up the changes, you should now only see the non-draft posts in your blog home page.

<div class="breaker"></div> <a id="#different-headers"></a>

## 5. Different headers for different pages

At some point, I realized, I didn't want to see my face at the top of every single page - Blog, About, Project, Consulting, in addition to Home.

The place you can change this is a familiar one - the header.html file we modified in section 2 above. Add the two sections below to the header.html file, and you should now have a more minimal header on all pages except the Home page.

<script src="https://gist.github.com/aannasw/cb895b8bb72d73926f0a.js"></script>

<div class="breaker"></div> <a id="tags"></a>

## 6. Tags and Tag Indexes

This one's a little involved, but still not too hard. Let's look at the various phases of this:

1. Add the ruby script in the plugins folder
2. Update the tag links inside blog posts to be clickable links
3. Create a tag index page, just like a blog post page
4. Edit the blog post page to also show the tags
5. Create dummy folders and index.html pages (this is a GitHub quirk) to get the individual tag pages to show
6. Add a custom header and navigation to the top
