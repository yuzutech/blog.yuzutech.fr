#!/usr/bin/env bash

# force local packages
npm install ./packages/asciidoc-loader
npm install ./packages/ui-loader

# debug
env

antora --html-url-extension-style=indexify --pull site.yml --generator ./lib/generator.js
