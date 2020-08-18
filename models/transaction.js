const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  date: { type: Number, required: true },
  bought: { type: Number, required: true, unique: true },
  unitprice: { type: Number, required: true, minlength: 6 },
  brockerage: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  stock: { type: mongoose.Types.ObjectId, required: true, ref: 'Stock' },
});

module.exports = mongoose.model('Transaction', transactionSchema);
