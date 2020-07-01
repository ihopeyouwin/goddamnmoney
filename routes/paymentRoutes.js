const express = require('express');
const paymentsController = require('../controllers/paymentsController');
const { check } = require('express-validator');
const router = express.Router();

router.get('/:pid', paymentsController.getPaymentById);
router.get('/user/:uid', paymentsController.getPaymentsByUserId);
router.post('/', [
  check(['sum', 'category']).not().isEmpty()
], paymentsController.createPayment)

router.patch('/:pid', [
  check(['sum', 'category']).not().isEmpty()
  ], paymentsController.updatePayment);

router.delete('/:pid', paymentsController.deletePayment);


module.exports = router;