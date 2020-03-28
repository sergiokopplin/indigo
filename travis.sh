#!/usr/bin/env bash
set -e # halt script on error

echo 'Testing travis...'
bundle exec jekyll build
bundle exec htmlproofer ./_site --http-status-ignore "403"
