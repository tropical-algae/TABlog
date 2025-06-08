export $(grep -v '^#' .env | xargs)

[ -d "./dist" ] && rm -rf ./dist
rm -rf ./node_modules package-lock.json 
npm install
docker rm -f $IMAGE_NAME
docker rmi $IMAGE_NAME:$IMAGE_VERSION