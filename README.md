# ui-web
This is the repository for the web frontend of UC4.

For more information visit uc4.cs.upb.de or one of our other github projects.

# Deployment
This project can be deployed using docker.

## Setup
We recommend using a proxy server like nginx on the host machine to route the backend API endpoint. 

By default, the API will be expected at `localhost/api1`.

In production builds, this endpoint is configured in the `vue.config.js`.

## Configuration
All configuration which is relevant for deployment can be configured in the `vue.config.js` file in the root directory of this repository.

### Backend API URL
You can configure the API url inside the vue config to change the endpoint at which this application will expect the backend server.

By default, we support three endpoints, depending on the NODE_ENV variable of your shell. 
On windows cmd:
```
SET NODE_ENV=production  //to test against production cluster
SET NODE_ENV=development  //to test against develop cluster
SET NODE_ENV=experimental  //to test against experimental cluster
```
On windows PS:
```
$env:NODE_ENV="production"
$env:NODE_ENV="development"
$env:NODE_ENV="experimental"
```

Similarly, the configuration of our jest tests (which are implemented to validate the API and some unit tests), can be configured using
On windows cmd:
```
SET TEST_ENV=production  //to test against production cluster
SET TEST_ENV=development  //to test against develop cluster
SET TEST_ENV=experimental  //to test against experimental cluster
```
On windows PS:
```
$env:TEST_ENV="production"
$env:TEST_ENV="development"
$env:TEST_ENV="experimental"
```

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
Generate a keypair for localhost tls
```
openssl req -x509 -newkey rsa:4096 -days 365 -nodes -keyout certs/ca-key.pem -out certs/ca-cert.pem -subj '/C=DE/ST=NRW/L=Paderborn/CN=ca-localhost'
openssl req -newkey rsa:4096 -nodes -keyout certs/server-key.pem -out certs/server-req.pem -subj '/C=DE/ST=NRW/L=Paderborn/CN=localhost'
openssl x509 -req -in certs/server-req.pem -days 60 -CA certs/ca-cert.pem -CAkey certs/ca-key.pem -CAcreateserial -out certs/server-cert.pem
```
Choose a backend deployment:
```
SET NODE_ENV=production  //to test against production cluster
SET NODE_ENV=development  //to test against develop cluster
SET NODE_ENV=experimental  //to test against experimental cluster
```
Similarly, the configuration of our jest tests (which are implemented to validate the API and some unit tests), can be configured using
On windows cmd:
```
SET TEST_ENV=production  //to test against production cluster
SET TEST_ENV=development  //to test against develop cluster
SET TEST_ENV=experimental  //to test against experimental cluster
```
On windows PS:
```
$env:TEST_ENV="production"
$env:TEST_ENV="development"
$env:TEST_ENV="experimental"
```

Run the development frontend:
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
