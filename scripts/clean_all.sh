export $(grep -v '^#' .env | xargs)

read -p "删除 ./dist 目录？[Y/n] " ans
if [[ "$ans" != "n" && "$ans" != "N" ]]; then
  [ -d "./dist" ] && rm -rf ./dist
  echo "✅ 已删除 ./dist"
else
  echo "⏭️ 跳过删除 ./dist"
fi

read -p "删除 node_modules 和 package-lock.json 并重新安装依赖？[Y/n] " ans
if [[ "$ans" != "n" && "$ans" != "N" ]]; then
  rm -rf ./node_modules package-lock.json && npm install
  echo "✅ 已重新安装依赖"
else
  echo "⏭️ 跳过依赖重装"
fi

read -p "删除 Docker 容器 $IMAGE_NAME？[Y/n] " ans
if [[ "$ans" != "n" && "$ans" != "N" ]]; then
  docker rm -f $IMAGE_NAME
  echo "✅ 已删除容器 $IMAGE_NAME"
else
  echo "⏭️ 跳过删除容器"
fi

read -p "删除镜像 $IMAGE_NAME:$IMAGE_VERSION？[Y/n] " ans
if [[ "$ans" != "n" && "$ans" != "N" ]]; then
  docker rmi $IMAGE_NAME:$IMAGE_VERSION
  echo "✅ 已删除镜像 $IMAGE_NAME:$IMAGE_VERSION"
else
  echo "⏭️ 跳过删除镜像"
fi