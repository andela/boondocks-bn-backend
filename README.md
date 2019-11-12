[![Build Status](https://travis-ci.org/andela/boondocks-bn-backend.svg?branch=develop)](https://travis-ci.org/andela/boondocks-bn-backend)
[![Coverage Status](https://coveralls.io/repos/github/andela/boondocks-bn-backend/badge.svg)](https://coveralls.io/github/andela/boondocks-bn-backend)
[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

# Barefoot Nomad - Making company travel and accomodation easy and convinient.
=======

## Vision
Make company global travel and accommodation easy and convenient for the strong workforce of savvy members of staff, by leveraging the modern web.

---

## Database Set Up

- Install `postgresql` into your computer

- Create two databases:
    - `bn_dev` for development
    - `bn_test` for testing

- add connection string Urls to the `.env` file :
    - `DEV_DATABASE_URL=postgres://<username>:<password>@127.0.0.1:5432/bn_dev` for development
    - `TEST_DATABASE_URL=postgres://<username>:<password>@127.0.0.1:5432/bn_test` for testing

- Run migrations using `npm run migrate`

- To undo all the migrations run `npm run migrate:undo`
## Deployment

This app will be deployed on heroku, To access this app go to these link:
    - [Production URL](https://boondocks-bn-backend.herokuapp.com/)
    - [Staging](https://boondocks-bn-backend-staging.herokuapp.com/)
