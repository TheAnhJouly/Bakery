const express = require("express");
const router = express.Router();
const {
  getAllBigCategory,
  createBigCategory,
  getBigCategoryById,
  updateBigCategory,
  deleteBigCategory,
} = require("../controller/bigCategoryController");
const asyncHandle = require("../middlewares/asyncHandle");

//Lấy tất cả thông tin loại lớn
router.route("/").get(asyncHandle(getAllBigCategory));
//Lấy thông tin 1 loại lớn theo id
router.route("/:id").get(asyncHandle(getBigCategoryById));

module.exports = router;
