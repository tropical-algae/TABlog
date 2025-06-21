FROM nginx:1.27-alpine-slim

RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist .

ENTRYPOINT ["/app/scripts/run.sh"]
CMD ["nginx", "-g", "daemon off;"]