module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('locations', [{
    country: 'Kenya',
    city: 'Nairobi',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    country: 'Uganda',
    city: 'Kampala',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    country: 'Nigeria',
    city: 'Lagos',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    country: 'Egypt',
    city: 'Cairo',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    country: 'Ghana',
    city: 'Accra',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    country: 'US',
    city: 'New York',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    country: 'Rwanda',
    city: 'Kigali',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('locations', null, {})
};
