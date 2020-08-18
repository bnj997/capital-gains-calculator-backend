const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');

const transactionsRoutes = require('./routes/transactions-routes');
const stocksRoutes = require('./routes/stocks-routes');

const app = express();

app.use(bodyParser.json())


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/transactions', transactionsRoutes);
app.use('/api/stocks', stocksRoutes);


app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});


mongoose.
  connect(
    'mongodb://localhost:27017/Stocks', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}
  )
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });