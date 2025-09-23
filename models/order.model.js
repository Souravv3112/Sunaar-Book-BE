// models/order.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define("order", {
    order_id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "companies",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    lot_weight: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    karat: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    product: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    client_name: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    karigar_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null because it will be set to null on delete
      references: {
        model: "karigars", // Foreign key to the karigars table
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // Set to null if the referenced karigar is deleted
    },
    placed_by: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    placed_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    delivery_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  });

  return Order;
};
