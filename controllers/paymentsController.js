"use strict";
const HttpError = require('../utils/httpError');
const { validationResult } = require('express-validator');
const Payments = require('../models/payments');
const Wallets = require('../models/wallets');

const getPaymentById = async (req, res, next) => {
  const paymentId = parseInt(req.params.pid, 10);
  let payment;
  try {
    payment = await Payments.findOne({ where: { paymentId: paymentId } });
  } catch (err) {
    return next(new HttpError('something went wrong, fetching payment data failed', 500));
  }
  if (!payment) {
    return next(new HttpError('could not find a transaction with such id', 404))
  }
  if (payment.creator !== req.userData.userId) {
    return next(new HttpError('you are not allowed to see that payment', 403));
  }

  res.json({ payment })
}

const getPaymentsByUserId = async (req, res, next) => {
  const userId = parseInt(req.params.uid, 10);
  if (userId !== req.userData.userId) {
    return next(new HttpError('you are not allowed to see that information', 403));
  }
  let payments;
  try {
    payments = await Payments.findAll({ where: { creator: userId } });
  } catch (err) {
    return next(new HttpError('something went wrong, fetching payments data failed', 500));
  }
  if (!payments || !payments.length) {
    return next(new HttpError('could not find a transactions for that user'), 404)
  }
  res.json({ payments })
}

const createPayment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { wallet, sum, description, category, currency, date } = req.body;
  let usersWallet;
  try {
    usersWallet = await Wallets.findOne({ where: { walletId: wallet } });
  } catch (err) {
    return next(new HttpError('something went wrong, wallet check failed', 500));
  }
  if (usersWallet.creator !== req.userData.userId) {
    return next(new HttpError('you are not allowed to create payment in this wallet', 403));
  }

  let createdPayment;
  try {
    createdPayment = await Payments.create({
      creator: req.userData.userId,
      wallet,
      sum,
      description,
      category,
      currency: currency ? currency : usersWallet.currency,
      date: date ? new Date(date).toISOString() : Date.now().toISOString()
    })
  } catch (err) {
    return next(new HttpError('could not create payment, please try again'), 500)
  }
  res.status(201).json(createdPayment);
}

const updatePayment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const paymentId = parseInt(req.params.pid, 10);
  let payment;
  try {
    payment = await Payments.findOne({ where: { paymentId: paymentId } });
  } catch (err) {
    return next(new HttpError('something went wrong, could not fetch the payment', 500));
  }
  if (!payment) return next(new HttpError('updated payment does not exist'), 404)
  if (payment.creator !== req.userData.userId) {
    return next(new HttpError('you are not allowed to edit that data', 403));
  }
  const { sum, description, category, date } = req.body;
  let updatedPayment;
  try {
    updatedPayment = await Payments.update({
      sum: sum,
      description: description,
      category: category,
      date: date ? new Date(date).toISOString() : payment.date
    }, { where: { paymentId: paymentId } })
  } catch (err) {
    return next(new HttpError('could not update payment, please try again'), 500)
  }
  try {
    updatedPayment = await Payments.findOne({ where: { paymentId: paymentId } });
  } catch (err) {
    return next(new HttpError('something went wrong, could not fetch new payment', 500));
  }
  res.status(201).json({ message: 'payment successfully updated', updatedPayment });
}

const deletePayment = async (req, res, next) => {
  const paymentId = parseInt(req.params.pid, 10);
  let payment;
  try {
    payment = await Payments.findOne({ where: { paymentId: paymentId } });
  } catch (err) {
    return next(new HttpError('something went wrong, could not fetch the payment', 500));
  }
  if (!payment) return next(new HttpError('could not find payment to delete'), 404)

  if (payment.creator !== req.userData.userId) {
    return next(new HttpError('you are not allowed to delete that payment', 403));
  }

  try {
    await payment.destroy()
  } catch (err) {
    return next(new HttpError('something went wrong, for some reason payment was not deleted', 500));
  }
  res.status(200).json({ message: 'payment successfully deleted' });
}

exports.getPaymentById = getPaymentById;
exports.getPaymentsByUserId = getPaymentsByUserId;
exports.createPayment = createPayment;
exports.updatePayment = updatePayment;
exports.deletePayment = deletePayment;