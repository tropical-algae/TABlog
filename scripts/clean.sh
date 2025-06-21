export $(grep -v '^#' .env | xargs)

read -p "Delete ./dist directory? [Y/n] " ans
if [[ "$ans" != "n" && "$ans" != "N" ]]; then
  [ -d "./dist" ] && rm -rf ./dist
  echo "✅ ./dist directory deleted"
else
  echo "⏭️ Skipped deleting ./dist"
fi

read -p "Remove node_modules and package-lock.json and reinstall dependencies? [Y/n] " ans
if [[ "$ans" != "n" && "$ans" != "N" ]]; then
  rm -rf ./node_modules package-lock.json && npm install
  echo "✅ Dependencies reinstalled"
else
  echo "⏭️ Skipped dependency reinstallation"
fi

read -p "Remove Docker container $IMAGE_NAME? [Y/n] " ans
if [[ "$ans" != "n" && "$ans" != "N" ]]; then
  docker rm -f $IMAGE_NAME
  echo "✅ Docker container $IMAGE_NAME removed"
else
  echo "⏭️ Skipped container removal"
fi

read -p "Remove Docker image $IMAGE_NAME:$IMAGE_VERSION? [Y/n] " ans
if [[ "$ans" != "n" && "$ans" != "N" ]]; then
  docker rmi $IMAGE_NAME:$IMAGE_VERSION
  echo "✅ Docker image $IMAGE_NAME:$IMAGE_VERSION removed"
else
  echo "⏭️ Skipped image removal"
fi