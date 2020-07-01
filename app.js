const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/usersRoutes');
const paymentRoutes = require('./routes/paymentRoutes');



const app = express();
app.use(bodyParser.json());

app.use('/api/users', userRoutes)
app.use('/api/payments', paymentRoutes)
app.use((error, req, res, next) => {
  if(res.headerSent){
    return next(error)
  }
  res.status(error.code || 500);
  return res.json({ message: error.message || 'unknown error occurred' })
});

app.listen(5000)