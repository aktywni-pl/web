FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

# katalog z buildem Vite
COPY --from=build /app/dist /usr/share/nginx/html

# nasz config nginx dla SPA (fallback do index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
