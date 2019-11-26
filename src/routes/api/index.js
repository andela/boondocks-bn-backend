import swaggerJsdoc from 'swagger-jsdoc';
import express from 'express';
import { serve, setup } from 'swagger-ui-express';
import swaggerDefinition from '../../docs/api-specification';
import usersRouter from './users.route';
import rolesRouter from './roles.route';
import tripsRouter from './trips.route';
import authRouter from './auth';
import requestRouter from './requests.route';
import commentsRouter from './comments.route';
import hotelsRouter from './hotels.route';
import notificationRouter from './notifications.route';

const specs = swaggerJsdoc(swaggerDefinition);

const router = express.Router();
const prefix = '/api/v1';

router.use('/api/docs', serve);
router.use('/api/docs', setup(specs, {
  explorer: false,
  customeSiteTitle: 'Barefoot Nomad API'
}));

router.use(prefix, usersRouter);
router.use(prefix, rolesRouter);
router.use(`${prefix}/auth`, authRouter);
router.use(prefix, tripsRouter);
router.use(prefix, requestRouter);
router.use(prefix, commentsRouter);

router.use(prefix, hotelsRouter);
router.use(prefix, notificationRouter);

export default router;
