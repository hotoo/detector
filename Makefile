version = $(shell cat package.json | grep version | awk -F'"' '{print $$4}')

install:
	@spm install
	@npm install

build:
	@spm build

release-web:
	@spm build --umd detector
	@ghp-import dist
	@git push origin gh-pages

publish: build publish-doc release-web
	@npm publish
	@git tag $(version)
	@git push origin $(version)

publish-doc: clean
	@spm doc build
	@spm build --umd detector
	@cp -r dist _site
	@ghp-import _site
	@git push origin gh-pages

watch:
	@spm doc watch

clean:
	@rm -fr _site


lint:
	@./node_modules/eslint/bin/eslint.js ./detector.js ./tests/ ./bin/detector


test-cli:
	@mocha -R spec --timeout 5000 tests/cli.test.js

test-npm:
	@./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha \
		-- \
		--harmony \
		--reporter spec \
		--timeout 2000 \
		--inline-diffs \
		./tests/*.js


test-spm:
	@spm test

test: lint test-npm test-spm


.PHONY: build-doc publish-doc server clean test coverage release-web
