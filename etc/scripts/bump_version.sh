#!/usr/bin/env bash

# This script is used to bump the version of the application

if ! [ -x "$(command -v jq)" ]; then
  echo "Error: jq is not installed." >&2
  exit 1
fi

OLD_VERSION=$(grep '"version":' package.json | sed -E 's/.*"([^"]+)".*/\1/')
NEW_VERSION=$(echo "$OLD_VERSION" | awk -F. '{$NF = $NF + 1;} 1' OFS=.)
CURR_BRANCH=$(git rev-parse --abbrev-ref HEAD)

jq '.version = "'$NEW_VERSION'"' package.json >tmp.$$.json && mv tmp.$$.json package.json

echo "Version bumped from $OLD_VERSION -> $NEW_VERSION"
echo "Run the following commands to commit and push the changes?"
echo "  $ git add package.json"
echo "  $ git commit -m" "chore: bump version from $OLD_VERSION -> $NEW_VERSION"
echo -n "[Y/n] "

read -r -p "" response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
  git add package.json
  git commit -m "chore: Bump version $OLD_VERSION -> $NEW_VERSION"
else
  echo "Aborting..."
  exit 1
fi

echo -n "Push to remote $CURR_BRANCH branch? [Y/n] "
read -r -p "" response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
  git push origin $CURR_BRANCH
fi
