FROM node:latest as build-stage
ARG ENV_PUBLIC_PATH
ARG ENV_BACKEND_URL
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN sed -i "s|\$ENV_BACKEND_URL|$ENV_BACKEND_URL|g" .env.production
RUN sed -i "s|\$ENV_PUBLIC_PATH|$ENV_PUBLIC_PATH|g" vue.config.js
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf