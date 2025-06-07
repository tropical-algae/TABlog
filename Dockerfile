FROM nginx:1.27-alpine-slim

RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist .

RUN chmod +x ./scripts/run.sh

ENTRYPOINT ["/app/scripts/run.sh"]
CMD ["nginx", "-g", "daemon off;"]