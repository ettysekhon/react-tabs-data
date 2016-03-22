const express = require('express');
const apiController = require('./api.controller');
const router = express.Router(); // eslint-disable-line

router.route('/products').get(apiController.getProducts);

module.exports = router;
