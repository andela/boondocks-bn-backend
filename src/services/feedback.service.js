import db from '../models';
import AppError from '../utils/error';

const addFeeback = async (data) => {
  const { userId, hotelId } = data;

  const checkUserBooking = await db.booking.count({ where: { userId, hotelId } });

  if (checkUserBooking === 0) {
    throw new AppError('Please book the hotel to provide feedback', 400);
  }

  const createFeedback = await db.feedback.create(data);

  return createFeedback;
};

export default addFeeback;
