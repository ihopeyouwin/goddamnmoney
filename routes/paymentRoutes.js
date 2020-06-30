const express = require('express');

const router = express.Router();

DUMMY_PAYMENTS = [
  {
    id: 'p1',
    wallet: '001',
    sum: 40000,
    description: 'shopping',
    category: 'purchases',
    currency: 'BYN'
  },
  {
    id: 'p2',
    wallet: '001',
    sum: 30000,
    description: 'weekend at the seaside',
    category: 'leisure',
    currency: 'BYN'
  },
  {
    id: 'p3',
    wallet: '002',
    sum: 10000,
    description: 'dentist',
    category: 'health',
    currency: 'BYN'
  },
  {
    id: 'p4',
    wallet: '002',
    sum: 20000,
    description: 'car leasing',
    category: 'transport',
    currency: 'BYN'
  }
]

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid;
  const payment = DUMMY_PAYMENTS.find(p => {
    return p.id === placeId
  })
  if (!payment) {
    const error = new Error('could not find a transaction with such id')
    error.code = 404
    return next(error)
  }
  res.json({ payment })
});

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid;
  const payments = DUMMY_PAYMENTS.filter(p => {
    return p.wallet === userId
  })
  if (!payments.length) {
    const error = new Error('could not find a transactions for that user')
    error.code = 404
    return next(error)
  }
  res.json({ payments })
});


module.exports = router;