"use strict";
const HttpError = require('../utils/httpError');
const uuid = require('uuid/v4');
let DUMMY_PAYMENTS = [
  {
    id: 'p1',
    wallet: '001',
    sum: 40000,
    description: 'shopping',
    category: 'purchases',
    currency: 'BYN'
  },
  {
    id: 'p2',
    wallet: '001',
    sum: 30000,
    description: 'weekend at the seaside',
    category: 'leisure',
    currency: 'BYN'
  },
  {
    id: 'p3',
    wallet: '002',
    sum: 10000,
    description: 'dentist',
    category: 'health',
    currency: 'BYN'
  },
  {
    id: 'p4',
    wallet: '002',
    sum: 20000,
    description: 'car leasing',
    category: 'transport',
    currency: 'BYN'
  }
]

const getPaymentById = (req, res, next) => {
  const placeId = req.params.pid;
  const payment = DUMMY_PAYMENTS.find(p => {
    return p.id === placeId
  })
  if (!payment) {
    return next(new HttpError('could not find a transaction with such id', 404))
  }
  res.json({ payment })
}

const getPaymentsByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const payments = DUMMY_PAYMENTS.filter(p => {
    return p.wallet === userId
  })
  if (!payments || !payments.length) {
    return next(new HttpError('could not find a transactions for that user'), 404)
  }
  res.json({ payments })
}

const createPayment = (req, res, next) => {
  const { wallet, sum, description, category, currency } = req.body;
  const createdPlace = {
    id: uuid(),
    wallet,
    sum,
    description,
    category,
    currency
  }
  DUMMY_PAYMENTS.push(createdPlace);
  res.status(201).json(createdPlace);
}

const updatePayment = (req, res, next) => {
  const { sum, description, category } = req.body;
  const paymentId = req.params.pid
  /*  const updatedPayment = {
      ...DUMMY_PAYMENTS.find(p => p.id === paymentId)
    }*/
  const paymentIndex = DUMMY_PAYMENTS.findIndex(p => p.id === paymentId)
  if (paymentIndex === -1) return next(new HttpError('updated place does not exist'), 404)
  DUMMY_PAYMENTS[paymentIndex] = {
    ...DUMMY_PAYMENTS[paymentIndex],
    sum: sum,
    description: description,
    category: category
  }
  res.status(201).json(DUMMY_PAYMENTS[paymentIndex]);
}

const deletePayment = (req, res, next) => {
  const paymentId = req.params.pid;
  DUMMY_PAYMENTS = DUMMY_PAYMENTS.filter(p => p.id !== paymentId);
  res.status(200).json({ message: 'payment successfully deleted' });
}

exports.getPaymentById = getPaymentById;
exports.getPaymentsByUserId = getPaymentsByUserId;
exports.createPayment = createPayment;
exports.updatePayment = updatePayment;
exports.deletePayment = deletePayment;