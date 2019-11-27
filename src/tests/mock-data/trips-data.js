export default {
  trips: [{
    leavingFrom: 'Kigali',
    goingTo: 'Nairobi',
    travelDate: '2019-11-18',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: [1]
  },
  {
    leavingFrom: 'Kigali',
    goingTo: 'Nairobi',
    travelDate: '2019-11-18',
    returnDate: '2019-11-18',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: [3]
  }, {
    leavingFrom: 'Kigali',
    goingTo: 'Nairobi',
    travelDate: '2019-11-18',
    returnDate: '2019-11-18',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: [2]
  },
  {
    leavingFrom: 'Kigali',
    goingTo: 'Nairobi',
    travelDate: '2019-11-18',
    returnDate: '2019-11-18',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: [1],
    requestId: 1
  },
  {
    leavingFrom: 'Kigali',
    goingTo: 'Nairobi',
    travelDate: '2019-11-18',
    returnDate: '2019-11-18',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: [4]
  },
  {
    leavingFrom: 'Kigali',
    goingTo: 'Nairobi',
    travelDate: '2019-11-18',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: [3]
  },
  {
    leavingFrom: 'Kigali',
    goingTo: 'Nairobi',
    travelDate: '2019-11-18',
    returnDate: '2019-11-18',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: [2]
  }],
  multiCityTrips: [{
    leavingFrom: 'Kigali',
    goingTo: 'Nairobi',
    travelDate: '2019-11-18',
    returnDate: '2019-11-18',
    reason: 'visit our agents',
    hotelId: 1,
    type: 'return',
    rooms: [4]
  }],
  requests: [{
    userId: 1,
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
  }],
  bookings: [{
    userId: 1,
    hotelId: 1,
    roomId: 1
  }],
  hotels: [{
    locationId: 1,
    name: 'Marriot',
    image: 'image.png',
    description: 'hello world',
    services: 'Catering'
  },
  {
    locationId: 1,
    name: 'Marriot',
    image: 'image.png',
    description: 'hello world',
    services: 'Catering'
  }],
};
