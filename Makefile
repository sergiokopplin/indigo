docker:
	bash -c 'docker run --rm --volume="$PWD:/srv/jekyll" -p 4000:4000 -it jekyll/jekyll:latest jekyll serve'
