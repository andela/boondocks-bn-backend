import db from '../models';
import Responses from '../utils/response';

const checkHotel = async (req, res, next) => {
  const { hotelId } = req.params;

  const hotel = await db.hotel.findOne({ where: { id: hotelId } });

  if (!hotel) {
    return Responses.handleError(400, 'Hotel doesn\'t exist', res);
  }
  next();
};

export default checkHotel;
