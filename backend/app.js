const express = require('express');
const { mlProducts } = require('./controllers/ml.controller');

const app = express();
app.use(express.json());

const config = async (req, res , next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
  res.header('Access-Control-Allow-Headers', '*');
  next();
};

app.use(config);

app.get('/mercadolivre/:category', mlProducts);

module.exports = app;