const HttpError = require('../models/http-error');

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
  if (!stockWithTransactions || stockWithTransactions.transactions.length === 0) {
    return next(
      new HttpError('Could not find transactions for the provided stock id.', 404)
    );
  }
  res.json({ transactions: stockWithTransactions.transactions.map(transaction => transaction.toObject({ getters: true })) });
};

const addNewTransaction = async (req, res, next) => {
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
    const error = new HttpError(
      'Creating transaction failed, please try again.',
      500
    );
    return next(error);
  }

  if (!stockOwner) {
    const error = new HttpError('Could not find stock for provided id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdTransaction.save({ session: sess }); 
    stockOwner.transactions.push(createdTransaction); 
    await stock.save({ session: sess }); 
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating transaction failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ transaction: createdTransaction });
};





exports.getTransactionsForStock = getTransactionsForStock;
exports.addNewTransaction = addNewTransaction;

