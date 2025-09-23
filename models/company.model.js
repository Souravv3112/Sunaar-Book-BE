// models/company.js
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "Company",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address_line1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address_line2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "companies",
      timestamps: true,
    }
  );

  Company.associate = (models) => {
    // A company has many users
    Company.hasMany(models.User, { foreignKey: "company_id", as: "users" });

    // A company has many karigars
    Company.hasMany(models.Karigar, {
      foreignKey: "company_id",
      as: "karigars",
    });

    // A company has many orders
    Company.hasMany(models.Order, { foreignKey: "company_id", as: "orders" });
  };

  return Company;
};
