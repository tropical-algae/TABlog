#!/bin/sh

if [ -f ./scripts/buildPost.js ]; then
  echo "🛠️ Generating markdown index..."
  node ./scripts/buildPost.js
fi

echo "✅ Done. Starting Nginx"
exec "$@"