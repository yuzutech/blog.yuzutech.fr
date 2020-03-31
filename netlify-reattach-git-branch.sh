#!/usr/bin/env bash

# Netlify clone the repository and detach the HEAD
# Luckily, we can use git metadata to reattach the HEAD
# https://docs.netlify.com/configure-builds/environment-variables/#git-metadata
git remote add origin $REPOSITORY_URL
if [ $HEAD = "master" ]
then
  # since the branch "master" already exists on Netlify,
  # we first need to remove it to reattach the HEAD
  # on a new branch named "master"
  git branch -d master
fi
  git checkout -b $HEAD
