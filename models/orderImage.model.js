// models/orderImage.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrderImage = sequelize.define(
    "order_images", // Table name
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      imageUrl: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      order_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: "orders", // Foreign key to the orders table
          key: "order_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    }
  );

  return OrderImage;
};
