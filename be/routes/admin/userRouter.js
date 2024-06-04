const express = require("express");
const router = express.Router();
const { register, login, getAllUser, getUserById, updateUser, getUserByName, getUserByPhoneNumber } = require("../../controller/userController");
const asyncHandle = require("../../middlewares/asyncHandle");

// Lấy tất cả thông tin user
router.route("/").get(asyncHandle(getAllUser));

// Lấy thông tin 1 user theo id, update thông tin user có id 
router.route("/:id").get(asyncHandle(getUserById)).patch(asyncHandle(updateUser));

// Lấy tất cả thông tin user có tên là name hoặc sđt là phone
router.route("/:name").get(asyncHandle(getUserByName)).get(asyncHandle(getUserByPhoneNumber));

module.exports = router;
