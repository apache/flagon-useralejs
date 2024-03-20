.PHONY: build test

build:
	npm install
	npm run build
test:
	npm install
	npm run build
	npm run test