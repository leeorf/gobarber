<h1 align="center">
	<img alt="GoStack" src="../assets/logo.svg" width="200px" />
</h1>

<p align="center">
    <a href="https://github.com/leeorf">
      <img src="https://img.shields.io/badge/-Github-000?style=flat-square&logo=Github&logoColor=white&link=https://github.com/leeorf">
    </a>
    <a href="https://www.linkedin.com/in/leonardorodriguesf/">
      <img src="https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/leonardof/">
    </a>
</p>

<h1 align="center">GoBarber API</h1>

# :open_file_folder: Table of contents
- [About the project](#scissors-about-the-project)
- [Technologies](#space_invader-technologies)
- [API Endpoints](#traffic_light-api-endpoints)
- [Running the Backend](#gear-running-the-backend)

# :scissors: About the project
REST API that provides everything to organize appointments between the barbers and customers.

Customers can choose the best time to schedule a service.

Barbers can track and manage all their appointments.

- [ ] *In Progress:*</br>
~~Too see the *web client*, click here: [GoBarber Web](../frontend)~~.</br>
~~Too see the *mobile client*, click here: [GoBarber Mobile](../mobile).~~

# :space_invader: Technologies

Technologies used to develop the API:
- [Celebrate](https://github.com/arb/celebrate)
- [Class Transformer](https://github.com/typestack/class-transformer)
- [Date-fns](https://date-fns.org)
- [Docker](https://www.docker.com)
- [Express](https://expressjs.com)
- [Handlebars](https://handlebarsjs.com)
- [JSON Web Token (JWT)](https://jwt.io)
- [MongoDB](https://www.mongodb.com)
- [Multer](https://github.com/expressjs/multer)
- [Node.js](https://nodejs.org/en/)
- [Nodemailer](https://nodemailer.com)
- [PostgreSQL](https://www.postgresql.org)
- [Rate Limiter Flexible](https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example)
- [Redis](https://redis.io)
- [Tsyringe](https://github.com/microsoft/tsyringe)
- [TypeORM](https://typeorm.io/#/)
- [TypeScript](https://www.typescriptlang.org)
- [uuid v4](https://github.com/thenativeweb/uuidv4)

# :traffic_light: API Endpoints

These endpoints allow you to organize appointments between the barbers and customers, and also to manage the user profile (either barber or customer).

Some routes require the user to be logged in with a valid JWT Token. To generate a JWT the user must login in the `/sessions` route inside `Users` folder.

To see the endpoints click the button below or import the [Insomnia.json](./Insomnia.json) file on Insomnia.

<p align="center">
<a href="https://insomnia.rest/run/?label=GoBarber%20API&uri=https%3A%2F%2Fgithub.com%2Fleeorf%2Fgobarber%2Fblob%2Fmaster%2Fbackend%2FInsomnia.json" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>
</p>

# :gear: Running the Backend

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/lang/en/) or [npm](https://www.npmjs.com)
- [Docker](https://www.docker.com)

### First steps:
``` bash
# Install the dependencies
$ yarn

# Make a copy of '.env.example' to '.env'
# and set with YOUR environment variables.
# The AWS variables do not need to be filled for dev environment
$ cp .env.example .env

# Create an image of PostgreSQL using docker
$ docker run --name gobarber-postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres

# Create an image of MongoDB using docker
$ docker run --name gobarber-mongodb -p 27017:27017 -d -t mongo

# Create an image of Redis using docker
$ docker run --name gobarber-redis -p 6379:6379 -d -t redis:alpine

# Check the 'ormconfig.json' to see if is everything is set
# to connect with docker database containers

# Run the migrations
$ yarn typeorm migration:run

# To finish, run the api service
$ yarn dev:server
```
