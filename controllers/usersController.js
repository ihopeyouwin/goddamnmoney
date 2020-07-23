"use strict";
const HttpError = require('../utils/httpError');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const Wallets = require('../models/wallets');

const getUserData = async (req, res, next) => {
  const userId = parseInt(req.params.uid, 10);
  if (userId !== req.userData.userId) {
    return next(new HttpError('you are not allowed see that information', 403));
  }

  let user;
  try {
    user = await Users.findOne({
      where: { userId: userId },
      attributes: ['userId', 'name', 'email'],
      include: [{ model: Wallets, where: { creator: userId }, attributes: ['walletId', 'currency'] }]
    })
  } catch (err) {
    return next(new HttpError('something went wrong, fetching this data failed', 500));
  }
  if (!user) {
    return next(new HttpError('could not find a user with such id'), 404)
  }
  res.json({ user: user })
}

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password } = req.body;
  let hasUser;
  try {
    hasUser = await Users.findOne({ where: { email: email } });
  } catch (err) {
    return next(new HttpError('something went wrong, logging in failed', 500));
  }
  if (hasUser) {
    return next(new HttpError('could not create user, email is already exists'), 422)
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    return next(new HttpError('could not create user, please try again'), 500)
  }
  let createdUser;
  try {
    createdUser = await Users.create({
      name,
      email,
      password: hashedPassword
    }) //  userId is created automatically
  } catch (err) {
    return next(new HttpError('could not create user, please try again'), 500)
  }

  let defaultWallet = await createWallet(createdUser.userId);
  let token;
  try {
    token = jwt.sign({
      userId: createdUser.userId,
      email: createdUser.email
    }, 'godDamnMoney_HashKey', { expiresIn: '24h' })
  } catch (err) {
    return next(new HttpError('Logging in failed, failed to get a token'), 500)
  }
  res.status(201).json({
    createdUser: {
      userId: createdUser.userId,
      name: createdUser.name,
      email: createdUser.email,
      wallets: [defaultWallet]
    }, token
  })
}

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let identifiedUser;
  try {
    identifiedUser = await Users.findOne({ where: { email: email } });
  } catch (err) {
    return next(new HttpError('something went wrong, logging in failed', 500));
  }
  if (!identifiedUser) {
    return next(new HttpError('identification failed please check credentials'), 422)
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password)
  } catch (err) {
    return next(new HttpError('could not log in, password check failed'), 500)
  }
  if (!isValidPassword) return next(new HttpError('could not log in, incorrect password'), 401)

  let token;
  try {
    token = jwt.sign({
      userId: identifiedUser.userId,
      email: identifiedUser.email
    }, 'godDamnMoney_HashKey', { expiresIn: '24h' })
  } catch (err) {
    return next(new HttpError('Logging in failed, failed to get a token'), 500)
  }
  const { userId, name } = identifiedUser
  res.json({ message: 'logged in', token, userId, name, email })
}

const deleteUser = (req, res, next) => {
}
const addWallet = async (req, res, next) => {
  let wallet
  try {
    wallet = await Wallets.create({
      creator: req.userId
    })
  } catch (err) {
    return next(new HttpError('could not create user, please try again'), 500)
  }
  res.status(201).json({ wallet })
}
const removeWallet = (req, res, next) => {
}
const updateWallet = (req, res, next) => {
}

const createWallet = async (creatorId, currency) => {
  let wallet;
  try {
    if (currency) {
      wallet = await Wallets.create({
        creator: creatorId,
        currency: currency
      })
    } else {
      wallet = await Wallets.create({
        creator: creatorId,
      })
    }
  } catch (err) {
    throw new HttpError('could not init wallet for the user, please try again', 404);
  }
  return { walletId: wallet.walletId, currency: wallet.currency };
}

exports.getUserData = getUserData;
exports.signUp = signUp;
exports.login = login;

exports.addWallet = addWallet;
exports.removeWallet = removeWallet;
exports.updateWallet = updateWallet;
exports.deleteUser = deleteUser;