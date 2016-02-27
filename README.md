## Indigo Minimalist Jekyll Template - [Demo](http://sergiokopplin.github.io/indigo/)
[![Build Status](https://travis-ci.org/sergiokopplin/indigo.svg?branch=gh-pages)](https://travis-ci.org/sergiokopplin/indigo)

![Screenshot](https://raw.githubusercontent.com/sergiokopplin/indigo/gh-pages/screen-shot.png)

This is a simple and minimalist template for Jekyll for those who likes to eat noodles.

---

## What has inside?

- [Gulp](http://gulpjs.com/) && [BrowserSync](https://www.browsersync.io/)
- [Stylus](http://stylus-lang.com/) with [RSCSS](http://rscss.io/) Methodology
- [SVG](https://www.w3.org/Graphics/SVG/)
- Tests with [Travis](https://travis-ci.org/)
- No JS
- Google Speed: [98/100](https://developers.google.com/speed/pagespeed/insights/?url=http%3A%2F%2Fsergiokopplin.github.io%2Findigo%2F)

# Setup

1. [Install Jekyll](http://jekyllrb.com)
2. [Install NodeJS](https://nodejs.org/)
3. [Install Bundler](http://bundler.io/)
4. Fork the project [Indigo](https://github.com/sergiokopplin/indigo/fork)
5. Edit `_config.yml` with your data.
6. `bundle install`
7. `npm install`
8. `gulp`
9. open in your browser: `http://localhost:3000`

# Settings

You have to fill some informations on `_config.yml` to customize your site.

```
name: John Doe
bio: 'A Man who travels the world eating noodles'
picture: 'assets/images/profile.jpg'

url: http://YOURUSER.github.io
# like: http://sergiokopplin.github.io
permalink: /:title/

analytics: 'UA-MYANALYTICS'
disqus: mydisqus
facebook: myfacebook
twitter: mytwitter
instagram: myinstagram
linkedin: mylinkedin
youtube: myyoutube
spotify: myspotify
github: mygithub
email: myemail@gmail.com
```

## Tests

You can test your app with:

```bash
bundle exec htmlproof ./_site --verbose
````

If you want travis tests, you can take a look at:
- [http://www.raywenderlich.com/109418/travis-ci-tutorial](http://www.raywenderlich.com/109418/travis-ci-tutorial)

## Showcase

- [fohlen.github.io](http://fohlen.github.io/) by @[Lennard Berger](https://github.com/Fohlen)
- [gedankenstuecke.github.io](http://gedankenstuecke.github.io) by @[Bastian Greshake](https://github.com/gedankenstuecke)

> open a [pull-request](https://github.com/sergiokopplin/indigo/pulls) if you want your site in this awesome list

## Contributions

- [Siddhant Jain](http://github.com/siddhantjain)
- [Jeanderson Barros Candido](http://github.com/jeandersonbc)
- [Rootul Patel](http://github.com/rootulp)
- [Bastian Greshake](http://github.com/gedankenstuecke)
- [Phat Nguyen](http://github.com/npvinhphat)

## Problems?

Tell me on github or open a [issue](https://github.com/sergiokopplin/indigo/issues/new).

### Update your fork.

- [github.com/articles/syncing-a-fork/](https://help.github.com/articles/syncing-a-fork/)

---

## License

[MIT](http://kopplin.mit-license.org/) License © Sérgio Kopplin
