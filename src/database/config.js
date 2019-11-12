// configures the database urls according to the environment
import { config } from 'dotenv';

config();

export const development = {
  url: process.env.DEV_DATABASE_URL,
  dialect: 'postgres'
};
export const test = {
  url: process.env.TEST_DATABASE_URL,
  dialect: 'postgres'
};
export const production = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres'
};
