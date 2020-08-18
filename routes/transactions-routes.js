const express = require('express');
const transactionController = require('../controllers/transactions-controllers');
const router = express.Router();

router.get('/:sid', transactionController.getTransactionsForStock);

router.post('/', transactionController.addNewTransaction);

router.patch('/:tid', transactionController.editTransaction);
router.delete('/:tid', transactionController.deleteTransaction);


module.exports = router;
