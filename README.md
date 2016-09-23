
***

<p align="center">
    <b><a href="README.md#what-has-inside">What has inside?</a></b>
    |
    <b><a href="README.md#setup">Setup?</a></b>
    |
    <b><a href="README.md#settings">Settings</a></b>
    |
    <b><a href="README.md#how-to">How to</a></b>
    |
    <b><a href="README.md#tests">Tests</a></b>
    |
    <b><a href="README.md#donate">Donate</a></b>
    |
    <b><a href="README.md#problems">Problems</a></b>
</p>


## What has inside?

- [Jekyll](https://jekyllrb.com/), [Gulp](http://gulpjs.com/), [BrowserSync](https://www.browsersync.io/), [Sass](http://sass-lang.com/) ~[RSCSS](http://rscss.io/)~ and [SVG](https://www.w3.org/Graphics/SVG/)
- Tests with [Travis](https://travis-ci.org/)
- Google Speed: [98/100](https://developers.google.com/speed/pagespeed/insights/?url=http%3A%2F%2Fsergiokopplin.github.io%2Findigo%2F)
- No JS. :sunglasses:

## Setup

0. :star: to the project. :metal:
1. [Install Jekyll](http://jekyllrb.com), [NodeJS](https://nodejs.org/) and [Bundler](http://bundler.io/).
2. Fork the project [Indigo](https://github.com/sergiokopplin/indigo/fork)
3. Edit `_config.yml` with your data.
4. `bundle install`
5. `npm i && npm i -g gulp`
6. `gulp`
7. open in your browser: `http://localhost:3000`

## Settings

You must fill some informations on `_config.yml` to customize your site.

```
name: John Doe
bio: 'A Man who travels the world eating noodles'
picture: 'assets/images/profile.jpg'
...

and lot of other options, like width, projects, pages, read-time, tags, related posts, animations, multiple-authors, etc.
```

## How to:

- Article: How to Install Jekyll - by [Arti Annaswamy](https://github.com/aannasw). [Part 1](http://artiannaswamy.com/build-a-github-blog-part-1) and [Part 2](http://artiannaswamy.com/build-a-github-blog-part-2)
- [Emojis in the projects list?](https://github.com/sergiokopplin/indigo/issues/72)
- [Nokogiri dependencie problems?](https://github.com/sergiokopplin/indigo/issues/81)
- [Syncing a Fork](https://help.github.com/articles/syncing-a-fork/)
- [Tests with Travis CI - Tutorial](http://www.raywenderlich.com/109418/travis-ci-tutorial)
- [Why Sass?](https://github.com/sergiokopplin/indigo/issues/117)

#### Create posts:

You can use the `initpost.sh` to create your new posts. Just follow the command:

```
./initpost.sh -c Post Title
```

The new file will be created at `_posts` with this format `date-title.md`.

## Tests

You can test your app with:

```bash
npm run test
# or
bundle exec htmlproof ./_site
````

## Donate

If you liked my work, buy me a coffee <3

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=U7B6UM6QWLG7E)

## Problems?

Tell me on github or open a [issue](https://github.com/sergiokopplin/indigo/issues/new).

#### Inspirations:
- [Addy Osmani](https://addyosmani.com/)

---

[MIT](http://kopplin.mit-license.org/) License © Sérgio Kopplin
