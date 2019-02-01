# FAQ:

- Article: How to Install Jekyll - by [Arti Annaswamy](https://github.com/aannasw). [Part 1](http://artiannaswamy.com/build-a-github-blog-part-1) and [Part 2](http://artiannaswamy.com/build-a-github-blog-part-2)
- [Emojis in the projects list?](https://github.com/sergiokopplin/indigo/issues/72)
- [Nokogiri dependencie problems?](https://github.com/sergiokopplin/indigo/issues/81)
- [Syncing a Fork](https://help.github.com/articles/syncing-a-fork/)
- [Tests with Travis CI - Tutorial](http://www.raywenderlich.com/109418/travis-ci-tutorial)
- [Why Sass?](https://github.com/sergiokopplin/indigo/issues/117)
- [Jekyll Example](https://github.com/barryclark/jekyll-now) - how to clone, run and edit jekyll configs

# Docker configuration

- `make` or `docker-compose build && docker-compose up -d`

    > The server need some time to intialize at first, because it will install all dependencies.
    >
    > Use `make logs` or `docker logs jekyll_indigo -f` to check when the server is alive

## Available commands in the Makefile

- Show available Jekyll commands : `make help`
- Run tests: `make test`
- Clean environment : `make clean`
- Logs: `make logs`
- Remove container : `make stop`
