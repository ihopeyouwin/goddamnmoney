const express = require('express');
const paymentsController = require('../controllers/paymentsController')
const router = express.Router();

router.get('/:pid', paymentsController.getPaymentById);
router.get('/user/:uid', paymentsController.getPaymentsByUserId);
router.post('/', paymentsController.createPayment)

router.patch('/:pid',  paymentsController.updatePayment);

router.delete('/:pid', paymentsController.deletePayment);


module.exports = router;