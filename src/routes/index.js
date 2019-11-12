/* eslint-disable import/no-named-as-default */
import swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import swaggerDefinition from '../docs/api-specification';
import router from './api/index';

const specs = swaggerJsdoc(swaggerDefinition);

router.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  }

  return next(err);
});

router.use('/api/docs', serve);
router.use('/api/docs', setup(specs, {
  explorer: false,
  customeSiteTitle: 'Barefoot Nomad API'
}));

export default router;
