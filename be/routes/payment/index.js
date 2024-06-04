const express = require("express");
const router = express.Router();
router.use('/vnpay',require('./vnpayRouter'));
module.exports = router;