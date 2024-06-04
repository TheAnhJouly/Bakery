const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
router.all('/api/(:layout)?(/:path)?(/*)?', (request, response, next) => {
  var { layout, path } = request.params
  if (
    (layout === 'auth' && (path === 'register' || path === 'login')) ||
    (layout !== 'auth' && layout !== 'admin' && layout !== 'transactions' && layout !== 'payment')
  ) {
    next()
  } else {
    var token = request.headers.authorization
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          response.status(401).json({ message: 'Invalid token' })
        } else {
          if (layout === 'admin') {
            if (decode.role !== 'admin') response.status(403).json({ message: 'Forbidden' })
            else next()
          } else {
            next()
          }
        }
      })
    } else {
      response.status(403).json({ message: 'Forbidden' })
    }
  }
})
module.exports = router
