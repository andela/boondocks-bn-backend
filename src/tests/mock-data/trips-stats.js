export default {
  users: [
    {
      id: 10,
      firstName: 'John',
      lastName: 'Doe',
      password: '12345678',
      email: 'john@barefoot.com',
      role: 'manager'
    },
    {
      id: 2,
      firstName: 'Eric',
      lastName: 'Doe',
      password: '12345678',
      email: 'eric1@barefoot.com',
      role: 'manager'
    },
    {
      id: 3,
      firstName: 'Jonny',
      lastName: 'Doey',
      password: '12345678',
      email: 'jonny@barefoot.com',
      lineManagerId: 10,
      role: 'requester'
    },
    {
      id: 4,
      firstName: 'Jondoe',
      lastName: 'Doejohn',
      password: '12345678',
      email: 'jondoe@barefoot.com',
      role: 'travel_administrator'
    }],
  trips: [
    {
      leavingFrom: 12,
      goingTo: 15,
      travelDate: '2020-01-01',
      reason: 'visit our agents',
      hotelId: 1,
      type: 'one way',
      rooms: [91],
    },
  ],
  hotels: [
    {
      id: 1,
      locationId: 12,
      name: 'Marriot',
      image: 'image.png',
      description: 'hello world',
      services: 'Catering',
    },
  ],
  rooms: [
    {
      id: 91,
      hotelId: 1,
      name: 'Muhabura1',
      type: 'return',
      description: 'The best room ever',
      image: 'room.png',
      cost: 5000,
      status: 'available',
    }
  ],
};
