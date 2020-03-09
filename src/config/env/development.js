const config = {
  database: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
  },
  debug: true,
  PORT: process.env.PORT || 3000
};

module.exports = config;
