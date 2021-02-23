const express = require('express');
const controllers = require('../../controllers')

const router = express.Router();

router.get('/', controllers.api.auth.checkJWT, controllers.api.task.getTasks);
router.post('/', controllers.api.auth.checkJWT, controllers.api.task.createTask);
router.post('/:taskId', controllers.api.auth.checkJWT, controllers.api.task.update);
router.delete('/:taskId/delete', controllers.api.auth.checkJWT,controllers.api.task.delete);

module.exports = router;