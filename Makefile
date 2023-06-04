docker:
	docker run --name blog --volume="$PWD:/srv/jekyll" -p 4000:4000 -it jekyll/jekyll:latest jekyll serve
