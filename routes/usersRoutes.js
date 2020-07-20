const express = require('express');
const usersController = require('../controllers/usersController');
const { check } = require('express-validator');
const checkAuth = require('../middleware/checkAuth')
const router = express.Router();
const Payments = require('../models/payments');
const Users = require('../models/users');
const Wallets = require('../models/wallets');

router.post('/signup', [
  check( 'name').not().isEmpty(),
  check( 'email').normalizeEmail().isEmail(),
  check('password').isLength({ min: 6 })
],usersController.signUp);
router.post('/login', usersController.login);
router.get('/payments', (req, res) => {
  Payments.findAll({ raw: true }).then(users => {
    res.send(users)
  }).catch(err => console.log(err));
})
router.get('/users', (req, res) => {
  Users.findAll({ raw: true }).then(users => {
    res.send(users)
  }).catch(err => console.log(err));
})
router.get('/wallets', (req, res) => {
  Wallets.findAll({ raw: true }).then(users => {
    res.send(users)
  }).catch(err => console.log(err));
})

router.use(checkAuth);
router.get('/:uid', usersController.getUserData);

router.post('/addwallet/:wid', usersController.addWallet);
router.delete('/removewallet/:wid', usersController.removeWallet);
router.patch('/:pid',  usersController.updateWallet);

module.exports = router;
