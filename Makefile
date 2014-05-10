THEME = $(HOME)/.spm/themes/arale
version = $(shell cat package.json | grep version | awk -F'"' '{print $$4}')

build:
	@spm build

publish: build
	@spm publish -s spmjs
	@git tag $(version)
	@git push origin $(version)
	@make publish-doc

build-doc:
	@nico build -C $(THEME)/nico.js

publish-doc: clean build-doc
	@spm publish -s spmjs --doc _site

server:
	@nico server -C $(THEME)/nico.js

watch:
	@nico server -C $(THEME)/nico.js --watch

clean:
	@rm -fr _site


runner = _site/tests/runner.html
test-src:
	@mocha-browser ${runner} -S

test-dist:
	@mocha-browser ${runner}?dist -S

test: test-src test-dist

output = _site/coverage.html
coverage: build-doc
	@rm -fr _site/src-cov
	@jscoverage --encoding=utf8 src _site/src-cov
	@mocha-browser ${runner}?cov -S -R html-cov > ${output}
	@echo "Build coverage to ${output}"


.PHONY: build-doc publish-doc server clean test coverage
