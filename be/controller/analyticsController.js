const db = require('../models')
const Sequelize = require('sequelize')
const { Transaction,User } = db.models
const dayjs = require('dayjs')
const RangeStatsType = {
  HOURLY: `%H`,
  DAILY: '%Y-%m-%d',
  MONTHLY: '%Y-%m',
  YEARLY: '%Y',
}

const analyticsController = {
  getTotalRevenue: async (req, res, next) => {
    try {
      let { dateStart, dateEnd, rangeType } = req.query;
      if (!dateStart) dateStart = dayjs().startOf('day');
      else dateStart = dayjs(dateStart)
      if(rangeType === 'hour') dateEnd = dateStart.endOf('day');
      dateStart = dateStart.format('YYYY-MM-DD HH:mm:ss')
      const createdAt = {
        [Sequelize.Op.gte]: dateStart, // gte : >= 
      }
      if (dateEnd) createdAt[Sequelize.Op.lte] = dayjs(dateEnd).format('YYYY-MM-DD HH:mm:ss') // lte <= 
      
      const result = await Transaction.findAll({
        attributes: [
          ['transactionMethod', 'method'],
          ['deliveryStatus', 'status'],
          'paymentstatus',
          'totalPrice',
        ],
        where: {
          createdAt,
          // deliveryStatus: {
          //   [Sequelize.Op.ne]: 'cancelled',
          // },
        },
      })
      res.status(200).json(result)
    } catch (e) {
      console.log(e)
      res.status(500)
    }
  }, // lấy dữ liệu theo ... 
  getStatsData: async (req, res, next) => {
    try {
      let { dateStart, dateEnd, rangeType , statsType} = req.query;
      if(!statsType) statsType = "revenue";
      if (!dateStart) dateStart = dayjs();
      else dateStart = dayjs(dateStart)
      rangeType ? rangeType.toLowerCase() : 'day'
      let format
      switch (rangeType) {
        case 'month':
          format = RangeStatsType.MONTHLY
          dateStart = dateStart.startOf('month');
          break
        case 'year':
          format = RangeStatsType.YEARLY
          dateStart = dateStart.startOf('year');
          break
        case 'day':
          format = RangeStatsType.DAILY
          dateStart = dateStart.startOf('day');
          break
        case 'hour':
          format = RangeStatsType.HOURLY
          dateStart = dateStart.startOf('day');
          dateEnd = dateStart.endOf('day');
          break
        default:
          return res.status(500).send('Invalid range type')
      }
      dateStart = dateStart.format('YYYY-MM-DD HH:mm:ss')
      const createdAt = {
        [Sequelize.Op.gte]: dateStart,
      }
      if (dateEnd) createdAt[Sequelize.Op.lte] = dayjs(dateEnd).format('YYYY-MM-DD HH:mm:ss')
      let result;
      if(statsType==="revenue"){ result = await Transaction.findAll({
        attributes: [
          [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), format), 'time'],
          [Sequelize.fn('SUM', Sequelize.col('totalPrice')), 'total'],
        ],
        where: {
          createdAt,
          deliveryStatus:{ // trạng thái giao dịch 
            [Sequelize.Op.in]:['received','shipping','init'], 
          }
        },
        group: [Sequelize.literal('time')], // chỉ định cột time được sử dụng để nhóm kết quả của một truy vấn.
      })}// thống kê theo từng khung thời gian
      else if(statsType === "user"){
        result = await User.findAll({
          attributes:[ // DATE_FORMAT định dạng cột createdAt dùng biến định dạng và chuỗi kết quả cung cấp tgian
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), format), 'time'], 
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'total'], //COUNT số hàng + giá trị ,kết quả cung cấp cho total
          ],where: {
            createdAt,
            role:{
              [Sequelize.Op.ne]: 'admin'
            }
          },
          group: [Sequelize.literal('time')], //literal chỉ định các cột sẽ được sử dụng để nhóm kết quả
          order: [Sequelize.literal('time')], // chỉ định thứ tự trả kết quả ( time - group - time - order - time )
        })
      }
      res.status(200).json(result)
    } catch (e) {
      console.log(e)
    }
  },
}

module.exports = analyticsController
