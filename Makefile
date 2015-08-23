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


runner = _site/tests/runner.html
test-npm:
	@mocha -R spec tests/detector-spec.js
	@mocha -R spec tests/morerule-test.js

test-spm:
	@spm test

lint:
	@./node_modules/eslint/bin/eslint.js ./detector.js ./tests/ ./bin/detector

test: lint test-npm test-spm

output = _site/coverage.html
coverage: build-doc
	@rm -fr _site/src-cov
	@jscoverage --encoding=utf8 src _site/src-cov
	@mocha-browser ${runner}?cov -S -R html-cov > ${output}
	@echo "Build coverage to ${output}"


.PHONY: build-doc publish-doc server clean test coverage
