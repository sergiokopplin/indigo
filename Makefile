.PHONY: run-dev, build, help

run-dev: build-dev ## Generate and serve website on http://localhost:4000
	@docker run -p 80:80 test-jekyll

build-dev: ## Build website in _site folder
	@docker build -t test-jekyll --build-arg config=_config.yml,_config-dev.yml -f ./docker/Dockerfile.build .

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help