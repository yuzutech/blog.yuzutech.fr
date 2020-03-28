#!/usr/bin/env bash

# force local packages
npm install ./packages/asciidoc-loader
npm install ./packages/ui-loader

# reattach the branch!
git remote add origin $REPOSITORY_URL
git checkout -b $HEAD

antora --html-url-extension-style=indexify --pull site.yml --generator ./lib/generator.js
