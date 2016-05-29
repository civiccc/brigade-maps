#!/bin/bash
set -euo pipefail

if ! git diff --quiet; then
  echo "You have uncommitted changes that will be blown away!"
  exit 1
fi

if ! git diff --cached --quiet; then
  echo "You have uncommitted changes that will be blown away!"
  exit 1
fi

if [ ! -d .git ]; then
  git init
  git config user.name "Travis-CI Deploy Bot"
  git config user.email "tomdooner@gmail.com"
fi

# render everything
npm run render

git branch -D gh-pages 2>/dev/null || true
git checkout -b gh-pages
mv build/ocd-division .
git add ocd-division
git commit --quiet -m "Generated build at $(date)"
git push --force "https://x-api-token:${GITHUB_AUTH_TOKEN}@github.com/tdooner/brigade-maps.git" gh-pages
