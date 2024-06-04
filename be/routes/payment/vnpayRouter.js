const express = require("express");
const router = express.Router();
const {
  createPaymentURL,
  vnpayReturn,
  vnpayIpn,
  queryDr,
  refund,
} = require("../../controller/paymenController/vnpay");
const asyncHandle = require("../../middlewares/asyncHandle");
router.route("/create_payment_url").post(asyncHandle(createPaymentURL));
router.route("/vnpay_return").get(asyncHandle(vnpayReturn));
router.route("/vnpay_ipn").get(asyncHandle(vnpayIpn));
router.route("/querydr").post(asyncHandle(queryDr));
router.route("/refund").post(asyncHandle(refund));
module.exports = router;
