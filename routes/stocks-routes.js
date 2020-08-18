const express = require('express');
const stockController = require('../controllers/stocks-controllers');
const router = express.Router();

router.get('/', stockController.getAllStocks);

router.post('/', stockController.addNewStock);


module.exports = router;
