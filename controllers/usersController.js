"use strict";
const HttpError = require('../utils/httpError');
const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let DUMMY_USERS = [{
  id: 'u1',
  name: 'Alex',
  email: 'alexUA007@gmail.com',
  password: '$2a$12$Nt/MrHkir0flrx/H.RC0E.UHVtp48RU0m6sGgeDAGbPYeB7XiDWf2',
  wallet: '001',
}]

const getUserData = (req, res, next) => {
  const userId = req.params.uid;
  const user = DUMMY_USERS.find(u => {
    return u.id === userId
  })
  if (!user) {
    return next(new HttpError('could not find a user with such id'), 404)
  }
  res.json({ user })
}

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find(u => u.email === email);
  if (hasUser) {
    return next(new HttpError('could not create user, email is already exists'), 422)
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    return next(new HttpError('could not create user, please try again'), 500)
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password: hashedPassword,
    wallet: uuid()
  }
  DUMMY_USERS.push(createdUser)

  let token;
  try {
    token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, 'godDamnMoney_HashKey', { expiresIn: '24h' })
  } catch (err) {
    return next(new HttpError('Logging in failed, failed to get a token'), 500)
  }
  res.status(201).json({ createdUser, token })
}

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!identifiedUser) {
    return next(new HttpError('identification failed please check credentials'), 422)
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password)
  } catch (err) {
    return next(new HttpError('could not log in, incorrect password'), 500)
  }
  if (!isValidPassword) return next(new HttpError('identification failed please check credentials'), 403)

  let token;
  try {
    token = jwt.sign({ userId: identifiedUser.id, email: identifiedUser.email }, 'godDamnMoney_HashKey', { expiresIn: '24h' })
  } catch (err) {
    return next(new HttpError('Logging in failed, failed to get a token'), 500)
  }

  res.json({ message: 'logged in', token, identifiedUser })
}
const addWallet = (req, res, next) => {
}
const removeWallet = (req, res, next) => {
}
const updateWallet = (req, res, next) => {
}

exports.getUserData = getUserData;
exports.signUp = signUp;
exports.login = login;
exports.addWallet = addWallet;
exports.removeWallet = removeWallet;
exports.updateWallet = updateWallet;