const dotenv = require('dotenv');

dotenv.config();
const config = {
  PORT: process.env.PORT || 3000,
  secret: process.env.SECRET,
  database: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
  googleConfig: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/google/callback'
  },
  facebookConfig: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/facebook/callback'
  },
  s3Config: {
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME
  },
  HASH_SALT_ROUNDS: 10,
  debug: false,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  env: process.env.NODE_ENV || 'development'
};

module.exports = config;
