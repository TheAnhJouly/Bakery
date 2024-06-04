const express = require("express");
const router = express.Router();
const {
  getAllCategory,
  getCategoryById,
  getCategoryByName,
} = require("../controller/categoryController");
const asyncHandle = require("../middlewares/asyncHandle");

//Lấy tất cả thông tin loại
router.route("/").get(asyncHandle(getAllCategory));

//Lấy thông tin 1 loại theo id
router.route("/:id").get(asyncHandle(getCategoryById));

router.route("/search").get(asyncHandle(getCategoryByName));

module.exports = router;
