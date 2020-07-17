const HttpError = require('../utils/httpError');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS'){
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // authorization: 'Bearer TOKEN'
    if (!token) {
      return next(new HttpError('cannot get access to that data, wrong token or authenticate first', 401))
    }
    const decodedToken = jwt.verify(token, 'godDamnMoney_HashKey');
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return next(new HttpError('cannot get access to that data, authentication failed', 403))
  }
}