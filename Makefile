all: sleep-diary-toolkit.min.js index.html

.PHONY: test

PROTO_DATA_STRUCTURES=entry_type diary_type diary_update_type
JS_FILES=src/browser_utils.js src/diary.js

src/data_structures.js: $(patsubst %,data_structures/%.proto,$(PROTO_DATA_STRUCTURES))
	pbjs -t static-module -w commonjs -o tmp/data_structures.js $^
	sed -e '1 s/^/\/**\n * @file Data structures from protocol buffers\n * @author Andrew Sayers <andrew-github.com@pileofstuff.org>\n * @copyright 2020\n * @license MIT\n *\/\n/' -e 's/\(require("protobufjs\/minimal")\);/(typeof module!=="undefined"\&\&module.exports)?\1:window.protobuf;/' -e 's/\(module.exports = .root;\)/if (typeof module!=="undefined"\&\&module.exports) { \1 } else { window.data_structures = $$root; }/' tmp/data_structures.js > $@
	rm -f tmp/data_structures.js

sleep-diary-toolkit.min.js: src/data_structures.js $(JS_FILES)
	mkdir -p tmp dest
	browserify $^ > tmp/browserify.js
	uglify -s tmp/browserify.js -o tmp/uglified.js
	sed -e '1 s/^/\/** Sleep Diary Toolkit | Copyright (C) Andrew Sayers | MIT License *\/\n/' tmp/uglified.js > $@
	rm -rf tmp/browserify.js tmp/uglified.js dest/*

index.html: README.md src/data_structures.js $(JS_FILES)
	jsdoc -d . --readme $^
	sed -i -e 's/<title>JSDoc: Home<\/title>/<title>Sleep Diary Toolkit<\/title>/' -e 's/<h1 class="page-title">Home<\/h1>/<h1 class="page-title">Sleep Diary Toolkit<\/h1>/' -e 's/\(<body.*>\)/\1<a href="https:\/\/github.com\/andrew-sayers\/sleep-diary-toolkit"><img loading="lazy" width="149" height="149" src="https:\/\/github.blog\/wp-content\/uploads\/2008\/12\/forkme_right_red_aa0000.png?resize=149%2C149" style="position:fixed;top:0;right:0" alt="Fork me on GitHub" data-recalc-dims="1"><\/a>/' index.html
