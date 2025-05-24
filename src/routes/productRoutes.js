const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/near-expiry', productController.getNearExpiry);

module.exports = router;
