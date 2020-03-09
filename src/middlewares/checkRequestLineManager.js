import Responses from '../utils/response';
import { checkUserBelongsToManager } from '../services/request.service';

const requestBelongsLineManager = async (req, res, next) => {
  const { id } = req.params;
  const currentUser = res.locals.user;

  const user = await checkUserBelongsToManager(currentUser.userId, id);
  if (!user) {
    return Responses.handleError(403, 'You have no access to approve or reject this request', res);
  }
  next();
};

export default requestBelongsLineManager;
