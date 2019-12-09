import Hash from '../../utils/hash';

export default {
  users: [
    {
      id: 1,
      firstName: 'Test',
      lastName: 'case',
      email: 'testcase@email.co',
      password: Hash.generateSync('fghtttfht55'),
      role: 'manager',
    },
    {
      id: 2,
      firstName: 'John',
      lastName: 'McCain',
      password: Hash.generateSync('1234567e'),
      email: 'john@mccain.com',
      lineManagerId: 1,
    }
  ],
  locations: [
    {
      id: 1,
      country: 'Rwanda',
      city: 'kigali',
    }
  ],
  hotels: [
    {
      id: 1,
      locationId: 1,
      name: 'Test hotel',
      image: '',
      street: 'kk 127',
      description: 'best ever hotel',
      services: 'service 1, service 2',
      userId: 1,
    }
  ],
  rooms: [
    {
      id: 1,
      hotelId: 1,
      name: 'Muhabura',
      type: 'return',
      description: 'The best room ever',
      image: 'room.png',
      cost: 5000,
      status: 'available',
    }
  ],
  trips: [
    {
      leavingFrom: 'Kigali',
      goingTo: 'Nairobi',
      travelDate: '2019-11-18',
      reason: 'visit our agents',
      hotelId: 1,
      type: 'return',
      rooms: [1],
    }
  ]
};
