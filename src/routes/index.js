const router = require("express").Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');

router.use('/api/docs', swaggerUi.serve);
router.get('/api/docs', swaggerUi.setup(swaggerDocument));

router.use("/api", require("./api"));

module.exports = router;
