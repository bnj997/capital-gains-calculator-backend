const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stockSchema = new Schema({
  stock: { type: String, required: true },
  transactions: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Transaction' }]
});

module.exports = mongoose.model('Stock', stockSchema);
