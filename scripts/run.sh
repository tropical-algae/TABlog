export $(grep -v '^#' .env | xargs)

docker run -itd --name tablog \
-p 10017:80 \
-v /data/tablog/config:/app/config \
-v /data/tablog/images:/app/images \
-v /data/tablog/markdowns:/app/markdowns \
$IMAGE_NAME:$IMAGE_VERSION
