const leavingDate = new Date();
const nextDay = leavingDate.getDate() + 1;
leavingDate.setDate(nextDay);

export default {
  trips: [{
    leavingFrom: 1,
    goingTo: 2,
    travelDate: '2019-11-18',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'one way',
    rooms: [1]
  },
  {
    leavingFrom: 1,
    goingTo: 2,
    travelDate: '2019-11-18',
    returnDate: '2019-11-20',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: [3]
  }, {
    leavingFrom: 1,
    goingTo: 2,
    travelDate: '2019-11-18',
    returnDate: '2019-11-24',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: [2]
  },
  {
    leavingFrom: 1,
    goingTo: 2,
    travelDate: '2019-11-18',
    returnDate: '2019-11-29',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: [1],
    requestId: 1
  },
  {
    leavingFrom: 1,
    goingTo: 2,
    travelDate: '2019-11-18',
    returnDate: '2019-11-21',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: [4]
  },
  {
    leavingFrom: 1,
    goingTo: 2,
    travelDate: '2019-11-18',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: [3]
  },
  {
    leavingFrom: 1,
    goingTo: 2,
    travelDate: '2019-11-18',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'one way',
    rooms: [2]
  },
  {
    leavingFrom: 1,
    goingTo: 2,
    travelDate: '2019-11-18',
    reason: 'visit our agents',
    type: 'one way',
  },
  {
    leavingFrom: 1,
    goingTo: 2,
    travelDate: '2019-11-18',
    returnDate: '2019-11-20',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: ['play']
  }, {
    leavingFrom: 1,
    goingTo: 2,
    travelDate: '2019-11-18',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'one way',
    rooms: [7]
  },
  {
    leavingFrom: 1,
    goingTo: 2,
    travelDate: '2019-11-18',
    returnDate: '2019-11-20',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: [8]
  }],
  multiCityTrips: [{
    leavingFrom: 1,
    goingTo: 2,
    travelDate: '2019-11-18',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'one way',
    rooms: [5]
  }],
  requests: [{
    userId: 19,
    type: 'multi'
  }],
  rooms: [{
    id: 1,
    hotelId: 1,
    name: 'Muhabura',
    type: 'return',
    description: 'The best room ever',
    image: 'room.png',
    cost: 5000,
    status: 'available',
  },
  {
    id: 2,
    hotelId: 1,
    name: 'Muhabura',
    type: 'return',
    description: 'The best room ever',
    image: 'room.png',
    cost: 5000,
    status: 'reserved'
  },
  {
    id: 3,
    hotelId: 1,
    name: 'Muhabura',
    type: 'return',
    description: 'The best room ever',
    image: 'room.png',
    cost: 5000,
    status: 'available'
  },
  {
    id: 4,
    hotelId: 1,
    name: 'Muhabura',
    type: 'return',
    description: 'The best room ever',
    image: 'room.png',
    cost: 5000,
    status: 'available'
  },
  {
    id: 5,
    hotelId: 1,
    name: 'Muhabura',
    type: 'VIP',
    description: 'The best room ever',
    image: 'room.png',
    cost: 5000,
    status: 'available'
  },
  {
    id: 6,
    hotelId: 1,
    name: 'Muhabura',
    type: 'VIP',
    description: 'The best room ever',
    image: 'room.png',
    cost: 5000,
    status: 'available'
  },
  {
    id: 7,
    hotelId: 1,
    name: 'Muhabura',
    type: 'VIP',
    description: 'The best room ever',
    image: 'room.png',
    cost: 5000,
    status: 'available'
  },
  {
    id: 8,
    hotelId: 1,
    name: 'Muhabura',
    type: 'VIP',
    description: 'The best room ever',
    image: 'room.png',
    cost: 5000,
    status: 'available'
  }],
  bookings: [{
    userId: 1,
    hotelId: 1,
    roomId: 1
  }],
  hotels: [{
    id: 1,
    locationId: 1,
    name: 'Marriot',
    image: 'image.png',
    description: 'hello world',
    services: 'Catering',
  },
  {
    locationId: 1,
    name: 'Marriot',
    image: 'image.png',
    description: 'hello world',
    services: 'Catering'
  }],
  booking: [
    {
      hotelId: 1,
      arrivalDate: new Date(),
      leavingDate,
      rooms: [4]
    },
    {
      hotelId: 1,
      arrivalDate: '2019-02-02',
      leavingDate,
      rooms: [2]
    },
    {
      hotelId: 1,
      arrivalDate: new Date(),
      leavingDate: '2019-02-02',
      rooms: [2]
    },
    {
      hotelId: 1,
      arrivalDate: new Date(),
      leavingDate,
      rooms: [200, 100]
    },
    {
      hotelId: 1,
      arrivalDate: new Date(),
      leavingDate,
      rooms: [2, 20]
    },
    {
      userId: 1,
      hotelId: 1,
      arrivalDate: new Date(),
      leavingDate,
      rooms: [5]
    }
  ]
};
