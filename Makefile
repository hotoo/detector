THEME = $(HOME)/.spm/themes/arale

build-doc:
	@nico build -v -C $(THEME)/nico.js

debug:
	@nico server -C $(THEME)/nico.js --watch debug

server:
	@nico server -C $(THEME)/nico.js

watch:
	@nico server -C $(THEME)/nico.js --watch

publish-doc: clean build-doc
	@rm -fr _site/sea-modules
	@spm publish --doc _site

clean:
	@rm -fr _site


reporter = spec
url = tests/runner.html
test-task:
	@mocha-phantomjs --reporter=${reporter} http://127.0.0.1:8000/${url}

test-dist:
	@node $(THEME)/server.js _site $(MAKE) test-task

test-src:
	@$(MAKE) test-dist url=tests/runner.html?src

test: test-src test-dist

coverage:
	@rm -fr _site/src-cov
	@jscoverage --encoding=utf8 src _site/src-cov
	@$(MAKE) test-dist reporter=json-cov url=tests/runner.html?cov | node $(THEME)/html-cov.js > _site/tests/coverage.html
	@echo "Build coverage to tests/coverage.html"


.PHONY: build-doc debug server publish clean test coverage
