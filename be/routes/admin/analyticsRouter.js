const express = require('express')
const router = express.Router();
const analyticsController = require('../../controller/analyticsController');
const asyncHandle = require('../../middlewares/asyncHandle');
const {getTotalRevenue, getStatsData} = analyticsController;
router.route("/total").get(asyncHandle(getTotalRevenue));
router.route("/stats").get(asyncHandle(getStatsData));
module.exports = router