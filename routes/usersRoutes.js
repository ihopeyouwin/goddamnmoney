const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('get request users');
  res.json({message: 'list of users'})
});


module.exports = router;