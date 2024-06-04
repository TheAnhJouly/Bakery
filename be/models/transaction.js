const { Sequelize, ENUM } = require("sequelize");
const paymentStatus = {
	INIT: "0",
	SUCCESS: "1",
	FAILURE: "2",
}
module.exports = (sequelize, DataTypes) => {
	const Transaction = sequelize.define("transactions", {
		deliveryStatus: {
			type: Sequelize.ENUM(
				"confirmming",
				"init",
				"shipping",
				"received",
				"canceled"
			),
			defaultValue: "confirmming",
			allowNull: false,
		},
		totalPrice: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		transactionMethod: {
			type: Sequelize.ENUM("cash", "vnpay"),
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
		},
		paymentstatus:{
			type: Sequelize.ENUM(
				paymentStatus.INIT,
				paymentStatus.SUCCESS,
				paymentStatus.FAILURE
			),
			defaultValue: paymentStatus.INIT,
			allowNull: false,
		}
	});
	return Transaction;
};
