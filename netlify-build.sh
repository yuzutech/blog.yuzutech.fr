#!/usr/bin/env bash

antora --html-url-extension-style=indexify --pull site.yml --generator ./lib/generator.js
