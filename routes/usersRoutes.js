const express = require('express');
const usersController = require('../controllers/usersController')
const router = express.Router();

router.get('/:uid', usersController.getUserData);
router.post('/signup', usersController.signUp);
router.post('/login', usersController.login);

router.post('/addwallet/:wid', usersController.addWallet);
router.delete('/removewallet/:wid', usersController.removeWallet);
router.patch('/:pid',  usersController.updateWallet);

module.exports = router;
