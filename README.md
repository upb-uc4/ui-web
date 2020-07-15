# ui-web
This is the repository for the web frontend of UC4.

For more information visit uc4.cs.upb.de or one of our other github projects.

# Deployment
This project can be deployed using docker.

## Setup
We recommend using a proxy server like nginx on the host machine to route the backend API endpoint. 

By default, the API will be expected at `localhost/api`.

## Configuration
All configuration which is relevant for deployment can be configured in the `vue.config.js` file in the root directory of this repository.

### PublicPath
You can edit the publicPath inside the vue config to change the endpoint at which this application will be served.

For example, if you want the website on some.domain.com/deploy/, the config should look like this:
```js
//vue.config.js
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/deploy/'
    : '/'
};
```
Here, `/deploy` is the endpoint used for production builds and `/` is used for development builds.
### Backend API URL
You can configure the API url inside the vue config to change the endpoint at which this application will expect the backend server.

For example, if you serve your API on some.domain.com/api, the config should look like this:
```js
//vue.config.js
process.env.VUE_APP_API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'http://localhost/api'
    : 'http://localhost:9000';
```
Here, `http://localhost/api` is the endpoint used for production builds and `http://localhost:9000` is used for development builds.
## Build docker image
Pre-built images for every version can be found on https://hub.docker.com/r/uc4official/ui-web

If you choose to build the application yourself, you can use docker:

Inside the root directory of this project, run

`docker build .` 

## Run docker container
You can build a container using your own image:

`docker run -p '8080:80' <image-id>`

This will run a new docker container and will map port 8080 of the host machine to port of the container, where the webinterface will be served.


Or you can use a pre-built container from us:

`docker run uc4official/ui-web:latest`

The container will be configured with the same configuration found in this repository. For more info, view the `vue.config.js` and `docker-compose.yml` files.

You can also use `docker-compose` to run the application, if you are in the root diretory:

`docker-compose up`

## Configuration of docker container


# Development Setup

To develop our application, you will need Node.js and an IDE of your choice.

## Project setup
```
npm install
```
Will install all dependencies for our application.
### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```