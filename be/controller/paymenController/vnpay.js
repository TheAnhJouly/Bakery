let express = require("express");
let router = express.Router();
let $ = require("jquery");
const request = require("request");
const moment = require("moment");
const db = require("../../models");
const Transaction = db.models.Transaction;

const vnpayController = {
  createPaymentURL: async (req, res, next) => {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let config = require("config");

    let tmnCode = config.get("vnp_TmnCode");
    let secretKey = config.get("vnp_HashSecret");
    let vnpUrl = config.get("vnp_Url");
    let returnUrl = config.get("vnp_ReturnUrl");
    let transactionId = req.body.transactionId;
    let orderId = moment(date).format("DDHHmmss") + "-" + transactionId;
    let transaction = await Transaction.findOne({
      where: { id: transactionId },
      attribute: ["totalPrice", "paymentstatus"],
    });
    if (!transaction) {
      return res.status(500).json({ message: "Invalid transaction id" });
    }
    await transaction.update({ paymenstatus: "0" });
    let amount = parseInt(transaction.totalPrice);
    let bankCode = req.body.bankCode;

    let locale = req.body.language;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    res.status(200).json({ url: vnpUrl });
  },

  vnpayReturn: (req, res, next) => {
    let vnp_Params = req.query;

    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    let config = require("config");
    let tmnCode = config.get("vnp_TmnCode");
    let secretKey = config.get("vnp_HashSecret");

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      res.send("success");
    } else {
      res.send("fail");
    }
  },

  vnpayIpn: async (req, res, next) => {
    try {
      let vnp_Params = req.query;
      let secureHash = vnp_Params["vnp_SecureHash"];

      let orderId = vnp_Params["vnp_TxnRef"];
      let amount = vnp_Params["vnp_Amount"] / 100;
      let rspCode = vnp_Params["vnp_ResponseCode"];

      delete vnp_Params["vnp_SecureHash"];
      delete vnp_Params["vnp_SecureHashType"];

      vnp_Params = sortObject(vnp_Params);
      let config = require("config");
      let secretKey = config.get("vnp_HashSecret");
      let querystring = require("qs");
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require("crypto");
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac
        .update(new Buffer.from(signData, "utf-8"))
        .digest("hex");

      let transactionId = orderId.split("-")[1];

      let transaction = await Transaction.findOne({
        where: {
          id: transactionId,
        },
        attribute: ["totalPrice", "paymentstatus"],
      });
      let checkOrderId = !!transaction;
      let checkAmount = parseInt(transaction.totalPrice) === amount;
      if (secureHash === signed) {
        //kiểm tra checksum
        if (checkOrderId) {
          if (checkAmount) {
            let paymentStatus = transaction.paymentstatus;
            console.log(paymentStatus);
            if (paymentStatus === "0") {
              //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
              if (rspCode == "00") {
                await transaction.update({
                  paymentstatus: "1",
                });
                res.status(200).json({ RspCode: "00", Message: "Success" });
              } else {
                await transaction.update({
                  paymentstatus: "2",
                });
                res.status(200).json({ RspCode: rspCode, Message: "Failure" });
              }
            } else {
              if (paymentStatus === "1")
                res.status(200).json({
                  RspCode: "00",
                  Message: "Success",
                });
              else
                res.status(200).json({
                  RspCode: "97",
                  Message: "Failure",
                });
            }
          } else {
            res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
          }
        } else {
          res.status(200).json({ RspCode: "01", Message: "Order not found" });
        }
      } else {
        res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
      }
    } catch (e) {
      console.log(e);
    }
  },

  queryDr: (req, res, next) => {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    let config = require("config");
    let crypto = require("crypto");

    let vnp_TmnCode = config.get("vnp_TmnCode");
    let secretKey = config.get("vnp_HashSecret");
    let vnp_Api = config.get("vnp_Api");

    let vnp_TxnRef = req.body.orderId;
    let vnp_TransactionDate = req.body.transDate;

    let vnp_RequestId = dateFormat(date, "HHmmss");
    let vnp_Version = "2.1.0";
    let vnp_Command = "querydr";
    let vnp_OrderInfo = "Truy van GD ma:" + vnp_TxnRef;

    let vnp_IpAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let currCode = "VND";
    let date = new Date();
    let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

    let data =
      vnp_RequestId +
      "|" +
      vnp_Version +
      "|" +
      vnp_Command +
      "|" +
      vnp_TmnCode +
      "|" +
      vnp_TxnRef +
      "|" +
      vnp_TransactionDate +
      "|" +
      vnp_CreateDate +
      "|" +
      vnp_IpAddr +
      "|" +
      vnp_OrderInfo;

    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac
      .update(new Buffer.from(data, "utf-8"))
      .digest("hex");

    let dataObj = {
      vnp_RequestId: vnp_RequestId,
      vnp_Version: vnp_Version,
      vnp_Command: vnp_Command,
      vnp_TmnCode: vnp_TmnCode,
      vnp_TxnRef: vnp_TxnRef,
      vnp_OrderInfo: vnp_OrderInfo,
      vnp_TransactionDate: vnp_TransactionDate,
      vnp_CreateDate: vnp_CreateDate,
      vnp_IpAddr: vnp_IpAddr,
      vnp_SecureHash: vnp_SecureHash,
    };
    // /merchant_webapi/api/transaction
    request(
      {
        url: vnp_Api,
        method: "POST",
        json: true,
        body: dataObj,
      },
      function (error, response, body) {
        console.log(response);
      }
    );
  },

  refund: (req, res, next) => {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    let config = require("config");
    let crypto = require("crypto");

    let vnp_TmnCode = config.get("vnp_TmnCode");
    let secretKey = config.get("vnp_HashSecret");
    let vnp_Api = config.get("vnp_Api");

    let vnp_TxnRef = req.body.orderId;
    let vnp_TransactionDate = req.body.transDate;
    let vnp_Amount = req.body.amount * 100;
    let vnp_TransactionType = req.body.transType;
    let vnp_CreateBy = req.body.user;

    let currCode = "VND";

    let vnp_RequestId = dateFormat(date, "HHmmss");
    let vnp_Version = "2.1.0";
    let vnp_Command = "refund";
    let vnp_OrderInfo = "Hoan tien GD ma:" + vnp_TxnRef;

    let vnp_IpAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let date = new Date();
    let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

    let vnp_TransactionNo = "0";

    let data =
      vnp_RequestId +
      "|" +
      vnp_Version +
      "|" +
      vnp_Command +
      "|" +
      vnp_TmnCode +
      "|" +
      vnp_TransactionType +
      "|" +
      vnp_TxnRef +
      "|" +
      vnp_Amount +
      "|" +
      vnp_TransactionNo +
      "|" +
      vnp_TransactionDate +
      "|" +
      vnp_CreateBy +
      "|" +
      vnp_CreateDate +
      "|" +
      vnp_IpAddr +
      "|" +
      vnp_OrderInfo;
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac
      .update(new Buffer.from(data, "utf-8"))
      .digest("hex");

    let dataObj = {
      vnp_RequestId: vnp_RequestId,
      vnp_Version: vnp_Version,
      vnp_Command: vnp_Command,
      vnp_TmnCode: vnp_TmnCode,
      vnp_TransactionType: vnp_TransactionType,
      vnp_TxnRef: vnp_TxnRef,
      vnp_Amount: vnp_Amount,
      vnp_TransactionNo: vnp_TransactionNo,
      vnp_CreateBy: vnp_CreateBy,
      vnp_OrderInfo: vnp_OrderInfo,
      vnp_TransactionDate: vnp_TransactionDate,
      vnp_CreateDate: vnp_CreateDate,
      vnp_IpAddr: vnp_IpAddr,
      vnp_SecureHash: vnp_SecureHash,
    };

    request(
      {
        url: vnp_Api,
        method: "POST",
        json: true,
        body: dataObj,
      },
      function (error, response, body) {
        console.log(response);
      }
    );
  },
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = vnpayController;
