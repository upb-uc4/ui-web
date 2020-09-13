FROM node:latest as build-stage
ENV CYPRESS_INSTALL_BINARY=0
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf