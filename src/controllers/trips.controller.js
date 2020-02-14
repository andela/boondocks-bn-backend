import Responses from '../utils/response';
import {
  createRequest,
  getRequestById,
  getUserTripsStats,
} from '../services/request.service';
import tripService from '../services/Trip.service';
import db from '../models';
import Mailer from '../services/Mailer.services';
import JWTHelper from '../utils/jwt';
import NotificationService from '../services/notification.service';
import NotificationUtil from '../utils/notification.util';
import UserService from '../services/User.service';
import bookingService from '../services/booking.service';

/**
 * Class for Trips
 */
class Trip {
  /**
   * Creates a return trip
   * @param {*} req
   * @param {*} res
   * @returns {Object} response
   */
  async createTrip(req, res) {
    const host = `${req.protocol}://${req.get('host')}`;
    const currentUser = res.locals.user;
    const {
      hotelId,
      leavingFrom,
      goingTo,
      type,
      travelDate,
      returnDate,
      reason,
      rooms
    } = req.body;

    const requestId = await createRequest(currentUser.userId, 'single');

    tripService.create({
      hotelId,
      type,
      leavingFrom,
      goingTo,
      travelDate,
      returnDate,
      reason,
      rooms,
      requestId,
      userId: currentUser.userId
    });

    const request = await getRequestById(requestId);
    const token = await JWTHelper.signToken(currentUser);
    if (currentUser.receiveNotification === true) {
      const mail = new Mailer({
        name: currentUser.name,
        to: currentUser.email,
        host,
        token
      });
      await mail.newTravelNotification();
    }
    const { firstName, email } = await UserService.getUserById(currentUser.lineManager);
    const mail = new Mailer({
      name: firstName,
      username: currentUser.name,
      to: email,
      requestId,
      token
    });
    await mail.lineManagerNotification();

    const { lineManager } = currentUser;

    const notification = await NotificationService.createNotification({
      requestId,
      messages: 'New Travel Requested',
      type: 'new_request',
      userId: lineManager,
    });

    NotificationUtil.echoNotification(req, notification, 'new_request', lineManager);
    const bookingDetails = await bookingService.getRequestBookingDetails(requestId);

    return Responses.handleSuccess(201, 'created', res, { request, bookingDetails });
  }

  /**
   * Create a multi cities trip request
   * @param {*} req
   * @param {*} res
   * @returns {Object} response
   */
  async createMultiCitiesTrip(req, res) {
    const host = `${req.protocol}://${req.get('host')}`;
    const trips = req.body;
    const currentUser = res.locals.user;

    const requestId = await createRequest(currentUser.userId, 'multi');

    trips.forEach(async (travel) => {
      const {
        hotelId,
        type,
        leavingFrom,
        goingTo,
        travelDate,
        returnDate,
        reason,
        rooms
      } = travel;

      tripService.create({
        hotelId,
        type,
        leavingFrom,
        goingTo,
        travelDate,
        returnDate,
        reason,
        rooms,
        requestId,
        userId: currentUser.userId
      });
    });

    const request = await getRequestById(requestId);
    const token = await JWTHelper.signToken(currentUser);
    if (currentUser.receiveNotification === true) {
      const mail = new Mailer({
        name: currentUser.name,
        to: currentUser.email,
        host,
        token
      });
      await mail.newTravelNotification();
    }

    const { firstName, email } = await UserService.getUserById(currentUser.lineManager);
    const mail = new Mailer({
      name: firstName,
      username: currentUser.name,
      to: email,
      host,
      token
    });
    await mail.lineManagerNotification();

    const { lineManager } = currentUser;
    const notification = await NotificationService.createNotification({
      requestId,
      messages: 'New Travel Requested',
      type: 'new_request',
      userId: lineManager,
    });
    NotificationUtil.echoNotification(req, notification, 'new_request', lineManager);
    const bookingDetails = await bookingService.getRequestBookingDetails(requestId);

    return Responses.handleSuccess(201, 'created', res, { request, bookingDetails });
  }

  /**
   * Updates a trip request
   * @param {*} req
   * @param {*} res
   * @returns {Object} response
   */
  async updateTrip(req, res) {
    const trip = await tripService.findTripById(req.params.tripId);
    const currentUser = res.locals.user;
    if (currentUser.userId !== trip.userId) {
      return Responses.handleError(403, 'you can only edit your own trips', res);
    }
    const tripRequest = await getRequestById(trip.requestId);
    if (tripRequest.status !== 'open') {
      return Responses.handleError(
        409,
        'you can only edit trips whose request status is open',
        res
      );
    }
    const updatedKeys = Object.keys(req.body);
    updatedKeys.forEach(async (key) => {
      // update other trip details except rooms
      if (key !== 'rooms') {
        trip[key] = req.body[key];
      }
      // check room availability
      if (key === 'rooms') {
        const { rooms } = req.body;
        // recreate booking
        await db.booking.destroy({
          where: {
            userId: currentUser.userId,
            tripId: trip.id
          }
        });
        rooms.forEach(async (room) => {
          await db.booking.create({
            userId: currentUser.userId,
            hotelId: req.body.hotelId,
            roomId: room,
            tripId: trip.id
          });
          await db.room.update({ status: 'reserved' }, {
            where: {
              id: room
            }
          });
        });
      }
    });
    await trip.save();
    const { lineManager } = currentUser;
    const notification = await NotificationService.createNotification({
      requestId: trip.requestId,
      messages: 'Open request edited',
      type: 'edited_request',
      userId: lineManager,
    });
    NotificationUtil.echoNotification(req, notification, 'edited_request', lineManager);
    return Responses.handleSuccess(201, 'trip details updated successfully', res, trip);
  }

  /**
   * Get a trip request
   * @param {object} req request
   * @param {object} res response
   * @return {Object} Get requests with pending status
   */
  async statistics(req, res) {
    const { user } = res.locals;
    const { fromDate } = req.query;
    const params = {
      user,
      fromDate,
      req,
    };
    const data = await getUserTripsStats(params);
    const trips = data.map(d => d.trips).flat();
    return Responses
      .handleSuccess(200, 'Trip Statistics Successfully retrieved', res, {
        total: trips.length,
        trips,
      });
  }
}

export default new Trip();
