const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const Transaction = require('../models/transaction');
const Stock = require('../models/stock');

const getTransactionsForStock = async (req, res, next) => {
  const stockID = req.params.sid;
  let stockWithTransactions;
  try {
    stockWithTransactions = await Stock.findById(stockID).populate('transactions');
  } catch (err) {
    const error = new HttpError(
      'Fetching transactions failed, please try again later.',
      500
    );
    return next(error);
  }
  if (!stockWithTransactions) {
    return next(
      new HttpError('Could not find transactions for the provided stock id.', 404)
    );
  }
  res.json({ transactions: stockWithTransactions.transactions.map(transaction => transaction.toObject({ getters: true })) });
};

const addNewTransaction = async (req, res, next) => {
  console.log(req.body)
  const {date, bought, unitPrice, brockerage, totalCost, stock } = req.body;
  const createdTransaction = new Transaction({
    date,
    bought,
    unitPrice,
    brockerage,
    totalCost,
    stock
  });

  let stockOwner;
  try {
    stockOwner = await Stock.findById(stock);
  } catch (err) {
    console.log("error")
    const error = new HttpError(
      'Creating transaction failed, please try again.',
      500
    );
    return next(error);
  }

  if (!stockOwner) {
    console.log("error")
    const error = new HttpError('Could not find stock for provided id.', 404);
    return next(error);
  }

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await createdTransaction.save(); 
    stockOwner.transactions.push(createdTransaction); 
    await stockOwner.save(); 
    // await sess.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      `Creating transaction failed, please try again. + ${err}`,
      500
    );
    return next(error);
  }

  res.status(201).json({ transaction: createdTransaction });
};



const editTransaction = async (req, res, next) => {
  const {date, bought, unitPrice, brockerage, totalCost} = req.body;
  const transactionId = req.params.tid;

  let transaction;
  try {
    transaction = await Transaction.findById(transactionId);
  } catch (err) {
    const error = new HttpError(
      `Something went wrong, could not update transaction.` ,
      500
    );
    return next(error);
  }

  transaction.date = date;
  transaction.bought = bought;
  transaction.unitPrice = unitPrice;
  transaction.brockerage = brockerage ;
  transaction.totalCost = totalCost

  try {
    await transaction.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update transaction.',
      500
    );
    return next(error);
  }

  res.status(200).json({ transaction: transaction.toObject({ getters: true }) });
 
};



const deleteTransaction = async (req, res, next) => {
  const transactionId = req.params.tid;
  let transaction;
  try {
    transaction = await Transaction.findById(transactionId).populate('stock');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete transaction.',
      500
    );
    return next(error);
  }

  if (!transaction) {
    const error = new HttpError('Could not find branch for this id.', 404);
    return next(error);
  }

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await transaction.remove();
    transaction.stock.transactions.pull(transaction);
    await transaction.stock.save();
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete transaction.',
      500
    );
    return next(error);
  }
  
  res.status(200).json({ message: 'Deleted transaction.' });
};





exports.getTransactionsForStock = getTransactionsForStock;
exports.addNewTransaction = addNewTransaction;
exports.editTransaction = editTransaction;
exports.deleteTransaction = deleteTransaction;

