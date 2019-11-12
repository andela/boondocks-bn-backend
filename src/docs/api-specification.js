const path = require('path');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Barefoot Nomad',
      version: '1.0.0',
      description:
            'Making company travel and accomodation easy and convenient.',
      license: {
        name: 'MIT',
        url: 'https://choosealicense.com/licenses/mit/'
      },
      contact: {
        name: 'Andela',
        url: 'https://andela.com'
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    servers: [
      {
        url: 'https://boondocks-bn-backend.herokuapp.com/api/v1',
        description: 'Production Server'
      },
      {
        url: 'https://boondocks-bn-backend-staging.herokuapp.com/api/v1',
        description: 'Staging Server'
      },
      {
        url: `localhost:${process.env.PORT || 3000}/api/v1`,
        description: 'Local Host'
      }
    ]
  },
  apis: [
    path.resolve(__dirname, '../docs/resources/*.yaml'),
    path.resolve(__dirname, '../routes/api/*.js')
  ]
};

module.exports = options;
