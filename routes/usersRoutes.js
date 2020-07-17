const express = require('express');
const usersController = require('../controllers/usersController');
const { check } = require('express-validator');
const checkAuth = require('../middleware/checkAuth')
const router = express.Router();


router.post('/signup', [
  check( 'name').not().isEmpty(),
  check( 'email').normalizeEmail().isEmail(),
  check('password').isLength({ min: 6 })
],usersController.signUp);
router.post('/login', usersController.login);

router.use(checkAuth);
router.get('/:uid', usersController.getUserData);

router.post('/addwallet/:wid', usersController.addWallet);
router.delete('/removewallet/:wid', usersController.removeWallet);
router.patch('/:pid',  usersController.updateWallet);

module.exports = router;
