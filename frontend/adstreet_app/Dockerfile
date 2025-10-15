FROM cirrusci/flutter:latest

WORKDIR /app

COPY pubspec.* ./
RUN flutter pub get

COPY . .

RUN flutter build web --release

# Serve the app using Nginx (or similar) in a multi-stage build
FROM nginx:stable-alpine
COPY --from=0 /app/build/web /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

