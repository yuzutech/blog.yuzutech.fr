#!/usr/bin/env bash

# Netlify clone the repository and detach the HEAD
# Luckily, we can use git metadata to reattach the HEAD
# https://docs.netlify.com/configure-builds/environment-variables/#git-metadata
git remote add origin $REPOSITORY_URL
git checkout -b $HEAD
