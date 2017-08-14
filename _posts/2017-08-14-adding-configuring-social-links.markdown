---
title: "Adding and Configuring Social Links"
layout: post
date: 2017-08-14 10:15
headerImage: false
tag:
- indigo
- how-to
- configuration
- social
- linkout
star: true
category: blog
author: johndoe
description: How-to add and configure social links
---

## Summary:

The Indigo theme allows users to maintain and display a selection of links to their social presence.
A recent modification to this functionality makes configuring and maintaining these links, very easy.

### Index
- [Background](#background)
- [Improvements](#improvements)

---

## Background 

Traditionally, a pre-defined set of social links were made available for the user to enable/disable, via the use of named configuration variables in `_config.yml`, like so:
```
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
```

Depending on which links were required, the user would un-comment (remove the '#' symbol at the beginning of the line) specific lines of the config and replace the dummy names (**myfacebook**, **mytwitter**, etc.) with their actual IDs from each of the sites.

Once enabled, the [`_includes/social-links.html`][1] file would rely on the configs and display the corresponding set of links along with icon assets from [`_include/icons.html`][2].

## Improvements

With the existing implementation, it was not very easy to add new links or re-order them on the home page. To make this process easier, the following improvements were made.

+ The manifest of social links was moved to a [YAML][3] formatted data file, [`_data/social-links.yml`][4], which stores the social site `name` (e.g. **facebook**), `url-prefix` (e.g. **facebook.com/**), `url-scheme` (e.g. **https://**) and `icon` name (only required, if the `icon` name was different from the social site `name`).

    Here are some sample configurations:
    ```
    - name: facebook
      url-prefix: facebook.com/

    - name: twitter
      url-prefix: twitter.com/

    - name: lanyrd
      url-prefix: lanyrd.com/
      url-scheme: 'http://'
      icon: microphone

    - name: email
      url-scheme: 'mailto:'
      icon: mail
    ```
+ The updated [`_includes/social-links.html`][5] file iterates over the entries in `_data/social-links.yml`, and makes use of the actual IDs configured in `_config.yml` along with the icons in `_includes/icons.html` to render the linkouts.

+ A new configuration variable called `social-links-order` in `_config.yml` allows the user to specify the explicit ordering of the linkouts (which overrides the listed order in `_data/social-links.yml` manifest file). For example:
    ```
    social-links-order: [github, facebook, twitter, medium, email]
    ```

[1]: https://github.com/sergiokopplin/indigo/blob/76d0b3c/_includes/social-links.html
[2]: https://github.com/sergiokopplin/indigo/blob/gh-pages/_includes/icons.html
[3]: http://yaml.org
[4]: https://github.com/sergiokopplin/indigo/blob/gh-pages/_data/social-links.yml
[5]: https://github.com/sergiokopplin/indigo/blob/gh-pages/_includes/social-links.html
