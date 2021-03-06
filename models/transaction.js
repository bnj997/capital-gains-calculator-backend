const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  date: { type: String, required: true },
  bought: { type: Number, required: true},
  unitPrice: { type: Number, required: true},
  brockerage: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  stock: {type: String, required: true, ref: 'Stock' },
});

module.exports = mongoose.model('Transaction', transactionSchema);
