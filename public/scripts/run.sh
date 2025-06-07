#!/bin/sh

if [ -f ./scripts/generateMarkdownIndex.js ]; then
  echo "Generating markdown index..."
  node ./scripts/generateMarkdownIndex.js
fi

echo "✅ Starting Nginx"
exec "$@"