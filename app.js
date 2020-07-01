"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./utils/httpError');
const userRoutes = require('./routes/usersRoutes');
const paymentRoutes = require('./routes/paymentRoutes');



const app = express();
app.use(bodyParser.json());

app.use('/api/users', userRoutes)
app.use('/api/payments', paymentRoutes)

app.use((req, res, next) => {
  throw new HttpError('Could not find this route.', 404);
});

app.use((error, req, res, next) => {
  if(res.headerSent){
    return next(error)
  }
  res.status(error.code || 500);
  return res.json({ message: error.message || 'unknown error occurred' })
});

app.listen(5000)