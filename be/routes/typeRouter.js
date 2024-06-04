const express = require("express");
const router = express.Router();
const {
  getAllType,
  getAllTypeTree,
  getTypeById,
} = require("../controller/typeController");
const asyncHandle = require("../middlewares/asyncHandle");

//Lấy tất cả thông tin về loại nam, nữ,..
router.route("/").get(asyncHandle(getAllType));

router.route("/type-tree").get(asyncHandle(getAllTypeTree));

//Lấy thông tin 1 về loại nam, nữ,.. theo id
router.route("/:id").get(asyncHandle(getTypeById));

module.exports = router;
