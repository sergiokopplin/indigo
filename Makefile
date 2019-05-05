.PHONY: run-dev, build, help

run-dev: build ## Generate and serve website on http://localhost:4000
	@docker run -p 4000:4000 test-jekyll --config _config.yml,_config-dev.yml

run-prod: build ## Generate and serve website on http://localhost:4000
	@docker run -p 4000:4000 test-jekyll --config _config.yml,_config-prod.yml

build: ## Build website in _site folder
	@docker build -t test-jekyll .

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help