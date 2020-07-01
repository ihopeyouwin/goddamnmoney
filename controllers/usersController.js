"use strict";
const HttpError = require('../utils/httpError');
const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

let DUMMY_USERS = [{
  id: 'u1',
  name: 'Alex',
  email: 'alexUA007@gmail.com',
  password: '12345',
  wallet: '001',
}]

const getUserData = (req, res, next) => {
  const userId = req.params.uid;
  const user = DUMMY_USERS.find(u => {
    return u.wallet === userId
  })
  if (!user) {
    return next(new HttpError('could not find a user with such id'), 404)
  }
  res.json({ user })
}

const signUp = (req, res, next) => {
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
  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
    wallet: uuid()
  }
  DUMMY_USERS.push(createdUser)
  res.status(201).json({ createdUser })
}

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError('identification failed please check credentials'), 422)
  }
  res.json({ message: 'logged in' })
}
const addWallet = (req, res, next) => {}
const removeWallet = (req, res, next) => {}
const updateWallet = (req, res, next) => {}

exports.getUserData = getUserData;
exports.signUp = signUp;
exports.login = login;
exports.addWallet = addWallet;
exports.removeWallet = removeWallet;
exports.updateWallet = updateWallet;