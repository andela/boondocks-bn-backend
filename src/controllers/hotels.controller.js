import hotelService from '../services/hotel.service';
import locationService from '../services/location.service';
import filesService from '../services/files.service';
import Responses from '../utils/response';
import roomService from '../services/room.service';
/**
 * Class for accomodation facilities
 */
class Hotel {
  /**
     * Creates hotel
     * @param {*} req
     * @param {*} res
     * @returns {Object} response
     */
  async createHotel(req, res) {
    const {
      name,
      description,
      services,
      street,
      city,
      country
    } = req.body;

    const { userId } = res.locals.user;
    const location = await locationService.create({ country, city });

    const locationId = location.id;

    const hotelExist = await hotelService.hotelExist(locationId, name);
    if (hotelExist) {
      return Responses.handleError(409, 'Hotel already exists in a location', res);
    }

    let image = '';
    if (req.file !== undefined) {
      const {
        filename,
        path
      } = req.file;

      image = await filesService.s3Upload(path, filename, 'hotels');
    }

    const hotel = await hotelService.create({
      locationId,
      userId,
      name,
      image,
      street,
      description,
      services
    });

    return Responses.handleSuccess(201, 'Hotel added successfully', res, hotel);
  }

  /**
   * Add a room to hotel
   * @param {*} req
   * @param {*} res
   * @returns {Object} response
   */
  async addRoom(req, res) {
    const {
      name,
      type,
      description,
      cost,
    } = req.body;

    const { hotelId } = req.params;

    let image = '';

    const { userId } = res.locals.user;

    const owner = await hotelService.isOwner(hotelId, userId);

    if (!owner) {
      return Responses.handleError(403, 'You don\'t have edit access to this hotel', res);
    }

    if (req.file !== undefined) {
      const {
        filename,
        path
      } = req.file;

      image = await filesService.s3Upload(path, filename, 'rooms');
    }
    const status = 'available';


    const room = await roomService.create({
      hotelId,
      name,
      image,
      type,
      description,
      cost,
      status
    });

    return Responses.handleSuccess(201, 'Room added successfully', res, room);
  }
}

export default new Hotel();
