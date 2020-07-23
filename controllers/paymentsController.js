"use strict";
const HttpError = require('../utils/httpError');
const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const Payments = require('../models/payments');
const Users = require('../models/users');
const Wallets = require('../models/wallets');
let DUMMY_PAYMENTS = [
  {
    id: 'p1',
    creator: 'u1',
    wallet: '001',
    sum: 40000,
    description: 'shopping',
    category: 'purchases',
    currency: 'BYN',
    date: '2020-05-12T15:03:00.164Z'
  },
  {
    id: 'p2',
    creator: 'u1',
    wallet: '001',
    sum: 30000,
    description: 'weekend at the seaside',
    category: 'leisure',
    currency: 'BYN',
    date: '2020-06-21T15:03:00.164Z'
  },
  {
    id: 'p3',
    creator: 'u1',
    wallet: '002',
    sum: 10000,
    description: 'dentist',
    category: 'health',
    currency: 'BYN',
    date: '2020-06-30T15:03:00.164Z'
  },
  {
    id: 'p4',
    creator: 'u1',
    wallet: '002',
    sum: 20000,
    description: 'car leasing',
    category: 'transport',
    currency: 'BYN',
    date: '2020-07-01T15:03:00.164Z'
  }
]

const getPaymentById = async (req, res, next) => {
  const paymentId = req.params.pid;

  let payment;
  try {
    payment = await Payments.findOne({ where: { paymentId: paymentId }});
  } catch (err) {
    return next(new HttpError('something went wrong, fetching payment data failed', 500));
  }
  if (!payment) {
    return next(new HttpError('could not find a transaction with such id', 404))
  }
  if (payment.creator.toString() !== req.userData.userId) {
    return next(new HttpError('you are not allowed to see that payment', 403));
  }

  res.json({ payment })
}

const getPaymentsByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  if (userId.toString() !== req.userData.userId) {
    return next(new HttpError('you are not allowed to see that information', 403));
  }
  let payments;
  try {
    payments = await Payments.findAll({ where: { creator: userId }});
  } catch (err) {
    return next(new HttpError('something went wrong, fetching payments data failed', 500));
  }
  if (!payments || !payments.length) {
    return next(new HttpError('could not find a transactions for that user'), 404)
  }
  res.json({ payments })
}

const createPayment = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { wallet, sum, description, category, currency, date } = req.body;
  const createdPlace = {
    id: uuid(),
    creator: req.userData.userId,
    wallet,
    sum,
    description,
    category,
    currency,
    date: new Date(date).toISOString()
  }
  DUMMY_PAYMENTS.push(createdPlace);
  res.status(201).json(createdPlace);
}

const updatePayment = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { sum, description, category, date } = req.body;
  const paymentId = req.params.pid;
  const paymentIndex = DUMMY_PAYMENTS.findIndex(p => p.id === paymentId);
  if (paymentIndex === -1) return next(new HttpError('updated place does not exist'), 404)

  let payment = DUMMY_PAYMENTS[paymentIndex];
  if (payment.creator.toString() !== req.userData.userId) {
    return next(new HttpError('you are not allowed to edit that data', 401));
  }

  DUMMY_PAYMENTS[paymentIndex] = {
    ...DUMMY_PAYMENTS[paymentIndex],
    sum,
    description,
    category,
    date: new Date(date).toISOString()
  }
  res.status(201).json(DUMMY_PAYMENTS[paymentIndex]);
}

const deletePayment = (req, res, next) => {
  const paymentId = req.params.pid;
  const paymentIndex = DUMMY_PAYMENTS.findIndex(p => p.id === paymentId)
  if (paymentIndex === -1) return next(new HttpError('could not find payment to delete'), 404)

  let payment = DUMMY_PAYMENTS[paymentIndex]
  if (payment.creator.toString() !== req.userData.userId) {
    return next(new HttpError('you are not allowed to delete that payment', 403));
  }

  DUMMY_PAYMENTS = DUMMY_PAYMENTS.filter(p => p.id !== paymentId);
  res.status(200).json({ message: 'payment successfully deleted' });
}

exports.getPaymentById = getPaymentById;
exports.getPaymentsByUserId = getPaymentsByUserId;
exports.createPayment = createPayment;
exports.updatePayment = updatePayment;
exports.deletePayment = deletePayment;