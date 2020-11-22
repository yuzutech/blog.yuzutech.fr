#!/usr/bin/env bash

# Netlify clone the repository and detach the HEAD
# Luckily, we can use git metadata to reattach the HEAD
# https://docs.netlify.com/configure-builds/environment-variables/#git-metadata
origin_remote_exists=$(git remote | grep origin || true)
if [[ -z "${origin_remote_exists}" ]]; then
  git remote add origin $REPOSITORY_URL
fi
current_branch="$HEAD"
branch_exists=$(git branch --list "${current_branch}")
if [[ ! -z "${branch_exists}" ]]; then
  # the branch already exists, remove it and reattach the HEAD (current branch)
  git branch -D "${current_branch}"
fi
git checkout -b "${current_branch}"
