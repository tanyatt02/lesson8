const express = require('express');
const cors = require('cors');
const controllers = require('../../controllers')
const corsConfig = require('../../config/cors.js')

const router = express.Router();

taskApiRouter = require('./task.js');
authApiRouter = require('./auth.js');

router.options('/v1/task', cors(corsConfig.corsOptions));
router.use('/v1/task', cors(corsConfig.corsOptions), taskApiRouter);
router.use('/v1/auth', cors(corsConfig.corsOptions), authApiRouter);

module.exports = router;