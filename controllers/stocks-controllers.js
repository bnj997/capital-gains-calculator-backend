const HttpError = require('../models/http-error');
const Stock = require('../models/stock');

const getAllStocks = async (req, res, next) => {
  let stocks;
  try {
    stocks = await Stock.find();
  } catch (err) {
    const error = new HttpError(
      'Fetching stocks failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ stocks: stocks.map(stock => stock.toObject({ getters: true })) });
};


const addNewStock = async (req, res, next) => {
  const {stock} = req.body;
  const createdStock = new Stock({
    stock,
    transactions: []
  });
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdStock.save(); 
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating Stock failed, please try again.',
      500
    );
    return next(error);
  }
  res.status(201).json({ stock: createdStock.toObject({ getters: true }) });
};

exports.getAllStocks = getAllStocks;
exports.addNewStock = addNewStock;

