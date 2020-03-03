/* eslint-disable newline-per-chained-call */
import Joi from '@hapi/joi';

const signupSchema = Joi.object().keys({
  firstName: Joi.string().strict().trim().required(),
  lastName: Joi.string().strict().trim().required(),
  email: Joi.string().strict().trim().email()
    .required(),
  password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).min(8).required()
}).options({
  abortEarly: false,
  language: {
    key: '{{key}} '
  }
});

const signinSchema = Joi.object().keys({
  email: Joi.string().strict().trim().email()
    .required(),
  password: Joi.required()
}).options({
  abortEarly: false,
  language: {
    key: '{{key}} '
  }
});

const resetPassword = Joi.object().keys({
  password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).min(8).required()
    .strict()
});

const oneWaySchema = Joi.object().keys({
  hotelId: Joi.number(),
  type: Joi.string().strict().trim().valid('one way').required(),
  leavingFrom: Joi.number().strict().required(),
  goingTo: Joi.number().strict().required(),
  travelDate: Joi.date().required(),
  reason: Joi.string().strict().required(),
  rooms: Joi.array().items(Joi.number().error(() => 'rooms must be an integer value'))
}).options({
  abortEarly: false,
  language: {
    key: '{{key}} '
  }
});

const date = new Date();
date.setHours(0, 0, 0, 0);

const bookingSchema = Joi.object().keys({
  hotelId: Joi.required(),
  arrivalDate: Joi.date().iso().min(date.toISOString()),
  leavingDate: Joi.date().iso().greater(Joi.ref('arrivalDate')).required(),
  rooms: Joi.required(),
}).options({
  abortEarly: false,
  language: {
    key: '{{key}} '
  }
});

const updateUserInfoSchema = Joi.object().keys({
  firstName: Joi.string().strict().trim(),
  lastName: Joi.string().strict().trim(),
  email: Joi.string().strict().trim().email()
    .required(),
  password: Joi.string().alphanum().min(8).strict(),
  birthDate: Joi.date().iso().min('1950-01-01T00:00:00.000Z').max('2010-12-31T00:00:00.000Z'),
  preferredLanguage: Joi.string().strict().trim(),
  preferredCurrency: Joi.string().strict().trim(),
  residenceAddress: Joi.string().strict().trim(),
  gender: Joi.string().strict().trim(),
  department: Joi.string().strict().trim(),
  lineManagerId: Joi.number().min(1),
  phoneNumber: Joi.string().regex(/^[().+\d -]{1,15}$/),
  remember: Joi.bool(),
}).options({
  abortEarly: false,
  language: {
    key: '{{key}} '
  }
});

const twoWaySchema = Joi.object().keys({
  hotelId: Joi.number(),
  type: Joi.string().strict().trim().valid('return').required(),
  leavingFrom: Joi.number().strict().required(),
  goingTo: Joi.number().strict().required(),
  travelDate: Joi.date().required(),
  returnDate: Joi.date().greater(Joi.ref('travelDate')).required(),
  reason: Joi.string().strict().required(),
  rooms: Joi.array().items(Joi.number().error(() => 'rooms must be an integer value')),
}).options({
  abortEarly: false,
  language: {
    key: '{{key}} '
  }
});

const hotelSchema = Joi.object().keys({
  name: Joi.string().strict().trim().required(),
  description: Joi.string().strict().trim().required(),
  services: Joi.string().strict().required(),
  street: Joi.string().strict().required(),
  city: Joi.string().strict().required(),
  country: Joi.string().strict().required()
}).options({
  abortEarly: false,
  language: {
    key: '{{key}} '
  }
});

const updateTripSchema = Joi.object().keys({
  hotelId: Joi.number().allow(null, ''),
  type: Joi.string().strict().trim().valid(
    'one way',
    'return',
  )
    .required(),
  leavingFrom: Joi.number().strict(),
  goingTo: Joi.number().strict(),
  travelDate: Joi.date(),
  returnDate: Joi.date()
    .when('type', {
      is: 'return',
      then: Joi.required(),
    }).allow(null, ''),
  rooms: Joi.array()
    .items(Joi.number().error(() => 'rooms must be an integer value')),
  reason: Joi.string().strict(),
}).options({
  abortEarly: false,
  language: {
    key: '{{key}} '
  }
});

const roomSchema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  cost: Joi.number().required(),
  hotelId: Joi.number().required()
}).options({
  abortEarly: false,
  language: {
    key: '{{key}} '
  },
  allowUnknown: true
});


const documentSchema = Joi.object().keys({
  name: Joi.string().required(),
}).options({
  abortEarly: false,
  language: {
    key: '{{key}} '
  },
  allowUnknown: false
});

const roleSchema = Joi.object().keys({
  email: Joi.string().strict().trim().email()
    .required(),
  role: Joi.string().strict().trim().valid(
    'super_administrator',
    'travel_administrator',
    'travel_team_member',
    'manager',
    'requester',
    'suppliers',
  )
    .required(),
}).options({
  abortEarly: false,
  language: {
    key: '{{key}} '
  }
});

const commentSchema = Joi.object()
  .keys({
    comment: Joi.string()
      .strict()
      .required(),
  })
  .options({
    abortEarly: false,
    language: {
      key: '{{key}} ',
    },
  });

const feedbackSchema = Joi.object()
  .keys({
    feedback: Joi.string()
      .strict()
      .required(),
  })
  .options({
    abortEarly: false,
    language: {
      key: '{{key}} ',
    },
  });

const searchRequestsSchema = Joi.object().keys({
  travelDate: Joi.date(),
  returnDate: Joi.date(),
  searchString: Joi.string().strict().trim().required(),
  byLineManager: Joi.string().strict().trim(),
}).options({
  abortEarly: false,
  language: {
    key: '{{key}} '
  }
});

const tripsStatsSchema = Joi.object()
  .keys({
    fromDate: Joi.date().optional().allow(null, ''),
    userId: Joi.number().optional().allow(null, ''),
  })
  .options({
    abortEarly: false,
    language: {
      key: '{{key}} '
    }
  });

const rateSchema = Joi.object()
  .keys({
    rating: Joi.number().integer().min(1).max(5)
      .strict()
      .required()
  })
  .options({
    abortEarly: false,
    language: {
      key: '{{key}} '
    }
  });

const updateRatingSchema = Joi.object()
  .keys({
    rating: Joi.number().integer().min(1).max(5)
      .strict()
      .required()
  })
  .options({
    abortEarly: false,
    language: {
      key: '{{key}} '
    }
  });

const updateTripBookingSchema = Joi.object().keys({
  paymentType: Joi.string().strict().trim().required().valid(
    'paypal',
    'stripe',
    'cash',
    'unpaid',
  ),
  description: Joi.string().trim().allow(null, '').when('paymentType', { is: 'stripe', then: Joi.required() }),
  source: Joi.string().trim().allow(null, '').when('paymentType', { is: 'stripe', then: Joi.required() }),
  currency: Joi.string().trim().allow(null, '').when('paymentType', { is: 'stripe', then: Joi.required() }),
  amount: Joi.number().allow(null, '').when('paymentType', { is: 'stripe', then: Joi.required() }),
  isPaid: Joi.bool().required(),
}).options({
  abortEarly: false,
  language: {
    key: '{{key}} '
  }
});

const updateDirectBookingSchema = Joi.object().keys({
  paymentType: Joi.string().strict().trim().required().valid(
    'paypal',
    'stripe',
    'cash',
    'unpaid',
  ),
  description: Joi.string().trim().allow(null, '').when('paymentType', { is: 'stripe', then: Joi.required() }),
  source: Joi.string().trim().allow(null, '').when('paymentType', { is: 'stripe', then: Joi.required() }),
  currency: Joi.string().trim().allow(null, '').when('paymentType', { is: 'stripe', then: Joi.required() }),
  amount: Joi.number().allow(null, '').when('paymentType', { is: 'stripe', then: Joi.required() }),
  isPaid: Joi.bool().required(),
  bookingIds: Joi.array().items(Joi.number().error(() => 'bookingIds must all be an integers')).required()
}).options({
  abortEarly: false,
  language: {
    key: '{{key}} '
  }
});

export default {
  '/auth/resetPassword': resetPassword,
  '/auth/signup': signupSchema,
  '/auth/signin': signinSchema,
  '/trips/oneway': oneWaySchema,
  '/user/update-profile': updateUserInfoSchema,
  '/trips/return': twoWaySchema,
  '/auth/user/role': roleSchema,
  '/requests/:requestId/comment': commentSchema,
  '/trips/:tripId': updateTripSchema,
  '/hotels': hotelSchema,
  '/hotels/:hotelId/rooms': roomSchema,
  '/booking': bookingSchema,
  '/search/requests': searchRequestsSchema,
  '/trips/stats': tripsStatsSchema,
  '/hotels/:hotelId/feedback': feedbackSchema,
  '/hotels/:hotelId/rating': rateSchema,
  '/rating/:ratingId': updateRatingSchema,
  '/booking/request/:requestId': updateTripBookingSchema,
  '/booking/payment': updateDirectBookingSchema,
  '/users/documents': documentSchema,
};
