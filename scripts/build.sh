#!/bin/sh
set -a
. ./.env
set +a

npm run build
chmod +x ./dist/scripts/run.sh
echo "✅ Successfully built web, get ready to build Docker Image!"

docker build -t $IMAGE_NAME:$IMAGE_VERSION .
echo "✅ Successfully built build Docker Image!"
