docker:
	docker run --name blog --volume="$PWD:/src/jekyll" -p 4000:4000 -it jekyll/jekyll:latest jekyll serve
