---
title: "Creating a Personal Blog with Jekyll and Github Pages"
layout: post
date: 2021-11-28 00:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- jekyll
- github
- githubpages
star: false
category: blog
author: masondenney
description: Personal Blog with Jekyll and Github Pages
---

## Intro
I wanted to create a blog and was interested in trying Github Pages since I wouldn't have to spend money on infrastructure.

## Resources
- Jekyll
- Github Pages
- Namecheap Domains

## Walkthrough
### Configure repo
I began by following the quickstart guide at <https://docs.github.com/en/pages/quickstart>. At this point, I did not choose a jekyll theme I simply created an index.html file with some text to test.

### Selecting a Framework
I decided to go with Jekyll as it was reccommended by Github Pages and I wanted it to be easily maintainable.
I'd also like to experiment with different Static Site Generators in the future like:
- Hugo
- Gatsby
- NextJS

### Selecting a Jekyll Theme
Next, I needed a theme for Jekyll. The [Jekyll documentation](https://jekyllrb.com/resources/) suggests checking out [http://jekyllthemes.org](http://jekyllthemes.org) and so I began browsing through themes.

I ran across the [Indigo theme](http://jekyllthemes.org/themes/indigo/) by [Sergio Kopplin](https://github.com/sergiokopplin) and decided to give it a try. I simply forked his repo and renamed the repo in the github pages format of <username>.github.io and created a 'main' branch.

### Customizing and Writing Posts
The next thing to do is to customize the look of the blog by changing the Sass/SCSS files and editing the layouts. I made changes like resizing my profile picture and changing navigation bar behavior.

The last thing to do is to write some posts in the _posts folder. I wrote my posts in markdown instead of HTML in the hopes it will be easier to migrate them at a later date.

### Configure DNS for Custom Domain Name (Optional)
If you want to use a custom domain, follow the instructions below:
I followed the guides below to change my Namecheap domain to point to Github Pages servers.
- [Github Docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Medium Article](https://hossainkhan.medium.com/using-custom-domain-for-github-pages-86b303d3918a)

## Conclusion
Setting up the blog was pretty easy and I'm glad Github Pages is free.