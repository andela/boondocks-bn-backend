import {
  getManagerRequestByStatus,
  getRequestbyStatus,
} from '../services/request.service';
import Responses from '../utils/response';

const queryRequestByStatus = async (req, res, next) => {
  const currentUser = res.locals.user;
  const reqQuery = req.query;
  const statusKey = Object.keys(reqQuery)[0];
  if (statusKey === 'status') {
    const status = reqQuery[statusKey];
    const checkStatusExist = ['approved', 'declined', 'open'].includes(status);
    if (checkStatusExist) {
      let requests = [];
      if (currentUser.role === 'requester') {
        requests = await getRequestbyStatus(status, currentUser.userId);
      }
      if (currentUser.role === 'manager') {
        requests = await getManagerRequestByStatus(status, currentUser.userId);
      }
      if (requests.length === 0) {
        return Responses.handleError(404, 'No Requests found', res);
      }
      return Responses.handleSuccess(200, 'successfully fetched the requests', res, requests);
    }
    return Responses.handleError(400, 'wrong request status', res);
  }
  next();
};

export default queryRequestByStatus;
