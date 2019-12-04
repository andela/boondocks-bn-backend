import Responses from '../utils/response';
import {
  getAllRequest,
  getOneRequest,
  updateRequestStatus,
  getManagerRequest,
  getSearchedRequests
} from '../services/request.service';

/**
 * Class requests
 */
class Requests {
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {object} successful got the requests
   */
  async getAll(req, res) {
    const currentUser = res.locals.user;
    const requests = await getAllRequest(currentUser.userId);
    if (requests.length === 0) {
      return Responses.handleError(404, 'No Requests found', res);
    }
    return Responses.handleSuccess(200, 'Successfully fetched the requests', res, requests);
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {object} successful fetched the requests
   */
  async getOne(req, res) {
    const requests = await getOneRequest(req.params.id);
    if (!requests) {
      return Responses.handleError(404, 'No Requests found with such id', res);
    }
    return Responses.handleSuccess(200, 'Successfully fetched the requests', res, requests);
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {object} successful fetched the requests
   */
  async getLineManagerRequest(req, res) {
    const currentUser = res.locals.user;
    const requests = await getManagerRequest(currentUser.userId);
    return Responses.handleSuccess(200, 'Successfully fetched the requests', res, requests);
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {object} succesful approved or rejected a request
   */
  async approveRequest(req, res) {
    const { status } = req.body;
    const { id } = req.params;

    await updateRequestStatus(id, status);

    const request = await getOneRequest(id);

    return Responses.handleSuccess(200, `Succesfully ${status} request`, res, request);
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {object} successful fetched the requests
   */
  async searchRequests(req, res) {
    const currentUser = res.locals.user;
    const requests = await getSearchedRequests(currentUser.userId, req.body);
    return Responses.handleSuccess(200, 'successfully retrieved search results', res, requests);
  }
}

export default new Requests();
