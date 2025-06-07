export $(grep -v '^#' .env | xargs)

[ -d "./dist" ] && rm -rf ./dist
docker rm -f $IMAGE_NAME
docker rmi $IMAGE_NAME:$IMAGE_VERSION