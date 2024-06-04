module.exports = (sequelize, DataTypes) => {
	const Type = sequelize.define("types", {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
	return Type;
};
