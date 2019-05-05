FROM jekyll/jekyll:latest as builder
WORKDIR /tmp
COPY Gemfile .

RUN bundle install
COPY . .

ENTRYPOINT [ "jekyll", "serve" ]
