[![Build Status](https://travis-ci.org/andela/boondocks-bn-backend.svg?branch=develop)](https://travis-ci.org/andela/boondocks-bn-backend)
[![Coverage Status](https://coveralls.io/repos/github/andela/boondocks-bn-backend/badge.svg)](https://coveralls.io/github/andela/boondocks-bn-backend)
[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

# Barefoot Nomad - Making company travel and accomodation easy and convinient.

## Vision
Make company global travel and accommodation easy and convenient for the strong workforce of savvy members of staff, by leveraging the modern web.

---

## GET STARTED

#### Set up

- Navigate to the directory where you want to copy this repo,clone it by running `git clone <link of the repo>`

- Install `postgresql` into your computer

- Create two databases:
    -  for development
    -  for testing

- add connection string Urls to the `.env` file :
    - `DEV_DATABASE_URL=postgres://<username>:<password>@127.0.0.1:5432/<database for dev>` for development
    - `TEST_DATABASE_URL=postgres://<username>:<password>@127.0.0.1:5432/<database for test>` for testing

    - Make a copy of the .env.example and rename it .env, add the corresponding project variables

- Run migrations using `npm run migrate`

- Run `npm run db:seed` for commit the seeds to the database

- To undo:
       - all seeders run `npm run db:seed:undo`
       - all migrations run `npm run migrate:undo`

#### Run the app

- Run `npm run watch` to start the server
- Use postman to test the endpoints

       
## Deployment

This app will be deployed on heroku, To access this app go to these link:
    - [Production URL](https://boondocks-bn-backend.herokuapp.com/)
    - [Staging](https://boondocks-bn-backend-staging.herokuapp.com/)

## API DOCUMENTATION
 - [Swagger documentation](https://boondocks-bn-backend-staging.herokuapp.com/api/docs)

## API Endpoints

| Request Route | Methods  | Description  |
| ------- | --- | --- |
| /api/v1/auth/signup | POST | Users can sign up |
| /api/v1/auth/signin | POST |  Users can sign in  |
| /api/v1/auth/verification| GET | Users should be sent a verification email after signup|
| /api/v1/auth/reverifyUser| GET | Users should be able to re-request for the verification if it expires|
| /api/v1//auth/forgotPassword | POST | Users should be sent a reset password link when it's requested |
| /api/v1/auth/resetPassword' | PATCH | Users should be to update their password |
| /api/v1/trips/return | POST | Users can request for a return trip |
| /api/v1/trips/oneway | POST | Users can request for a return trip |

## Docker

#### Setting Up Docker

1. Install Docker on your pc using instruction [here](https://docs.docker.com/install/). Make sure it's running well

2. Navigate to the directory where you want to copy this repo,clone it by running `git clone <link of the repo>`

3. Follow the `.env.example` file to setup your environment and populate with corresponding values

4. In your root directory run `docker build -t <your username>/node-web-app .` to build your docker image

5. Run `docker images` to assure that image was successfully created

6. Run `docker run -p <given port>:3000 -d <your username>/<image name>` to run your image

#### Run app on Docker

1. Run `docker-compose build` to create and start containers

2. Run `docker ps` to get container ID

3. Run `docker exec -it <container id> sh` to enter container

4. Run `npm migrate` followed by ` npx sequelize-cli db:seed:all`

5. Run `npm run watch` and test endpoint using postman using route `http://localhost:3000/<endpoind route>`