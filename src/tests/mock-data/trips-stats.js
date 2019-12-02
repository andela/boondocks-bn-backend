export default {
  users: [
    {
      id: 1,
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
      lineManagerId: 1,
      role: 'requester'
    },
    {
      id: 4,
      firstName: 'Jondoe',
      lastName: 'Doejohn',
      password: '12345678',
      email: 'jondoe@barefoot.com',
      lineManagerId: 1,
      role: 'travel_administrator'
    }],
  trips: [
    {
      leavingFrom: 'Kigali',
      goingTo: 'Nairobi',
      travelDate: '2019-11-18',
      reason: 'visit our agents',
      hotelId: 1,
      type: 'return',
      rooms: [91],
    },
  ],
  hotels: [
    {
      id: 1,
      locationId: 1,
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
