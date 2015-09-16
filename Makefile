version = $(shell cat package.json | grep version | awk -F'"' '{print $$4}')

install:
	@spm install
	@npm install

build:
	@spm build

publish: build publish-doc
	@spm publish
	@npm publish
	@git tag $(version)
	@git push origin $(version)

build-doc: clean
	@spm doc build

publish-doc: clean
	@spm doc publish

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


.PHONY: build-doc publish-doc server clean test coverage
