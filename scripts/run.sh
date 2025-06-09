export $(grep -v '^#' .env | xargs)

CONTAINER_MOUNT=${CONTAINER_MOUNT:-"/data/tablog"}
CONTAINER_MOUNT="${CONTAINER_MOUNT%/}"

docker run -itd --name tablog \
-p $CONTAINER_PORT:80 \
-v $CONTAINER_MOUNT/config:/app/config \
-v $CONTAINER_MOUNT/images:/app/images \
-v $CONTAINER_MOUNT/markdowns:/app/markdowns \
$IMAGE_NAME:$IMAGE_VERSION
