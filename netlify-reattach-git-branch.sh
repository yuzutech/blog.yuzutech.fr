#!/usr/bin/env bash

# Netlify clone the repository and detach the HEAD
# Luckily, we can use git metadata to reattach the HEAD
# https://docs.netlify.com/configure-builds/environment-variables/#git-metadata

# debug
echo $REPOSITORY_URL
echo $HEAD
echo $BRANCH
echo $PULL_REQUEST

echo "git remote add origin $REPOSITORY_URL"
git remote add origin $REPOSITORY_URL
echo "git checkout -b $HEAD"
git checkout -b $HEAD
