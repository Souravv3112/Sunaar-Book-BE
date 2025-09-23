const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
    username: {
      type: DataTypes.STRING(150), // Match VARCHAR(150)
      allowNull: false, // Make it required
      unique: true, // Set it as unique, similar to UNIQUE KEY
    },
    password: {
      type: DataTypes.STRING(128), // Match VARCHAR(128)
      allowNull: false, // Make it required
    },
  });

  return User;
};
