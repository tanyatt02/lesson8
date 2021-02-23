
const express = require('express');
const controllers = require('../controllers')
const db = require('../models/db.js');


const router = express.Router();



router.get('/', controllers.chat.getChat);

module.exports = router;

