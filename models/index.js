// const config = require("../config/db.config.js");

// const Sequelize = require("sequelize");
// const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
//   host: config.HOST,
//   dialect: config.dialect,
//   pool: {
//     max: config.pool.max,
//     min: config.pool.min,
//     acquire: config.pool.acquire,
//     idle: config.pool.idle,
//   },
// });

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.user = require("../models/user.model.js")(sequelize, Sequelize);
// db.role = require("../models/role.model.js")(sequelize, Sequelize);
// db.order = require("../models/order.model.js")(sequelize);
// db.orderImage = require("./orderImage.model")(sequelize);
// db.karigar = require("./karigar.model")(sequelize);

// // Defining associations
// db.order.hasMany(db.orderImage, { foreignKey: "order_id" });
// db.orderImage.belongsTo(db.order, { foreignKey: "order_id" });

// db.order.belongsTo(db.karigar, { foreignKey: "karigar_id" });
// db.karigar.hasMany(db.order, { foreignKey: "karigar_id" });

// db.role.belongsToMany(db.user, {
//   through: "user_roles",
// });
// db.user.belongsToMany(db.role, {
//   through: "user_roles",
// });

// db.ROLES = ["user", "admin"];

// module.exports = db;

const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.User = require("../models/user.model.js")(sequelize, Sequelize.DataTypes);
db.Role = require("../models/role.model.js")(sequelize, Sequelize.DataTypes);
db.Order = require("../models/order.model.js")(sequelize, Sequelize.DataTypes);
db.OrderImage = require("../models/orderImage.model.js")(
  sequelize,
  Sequelize.DataTypes
);
db.Karigar = require("../models/karigar.model.js")(
  sequelize,
  Sequelize.DataTypes
);
db.Company = require("../models/company.model.js")(
  sequelize,
  Sequelize.DataTypes
);

// Associations

// Company -> Users (1 company has many users)
db.Company.hasMany(db.User, {
  as: "users",
  foreignKey: "company_id",
  onDelete: "CASCADE",
});
db.User.belongsTo(db.Company, { foreignKey: "company_id", as: "company" });

// Company -> Karigars (1 company has many karigars)
db.Company.hasMany(db.Karigar, {
  as: "karigars",
  foreignKey: "company_id",
  onDelete: "CASCADE",
});
db.Karigar.belongsTo(db.Company, { foreignKey: "company_id", as: "company" });

// Company -> Orders (optional: if orders are tied to company)
db.Company.hasMany(db.Order, {
  as: "orders",
  foreignKey: "company_id",
  onDelete: "CASCADE",
});
db.Order.belongsTo(db.Company, { foreignKey: "company_id", as: "company" });

// Karigar -> Orders
db.Karigar.hasMany(db.Order, {
  as: "orders",
  foreignKey: "karigar_id",
  onDelete: "SET NULL",
});
db.Order.belongsTo(db.Karigar, { foreignKey: "karigar_id", as: "karigar" });

// Order -> OrderImages
db.Order.hasMany(db.OrderImage, {
  as: "images",
  foreignKey: "order_id",
  onDelete: "CASCADE",
});
db.OrderImage.belongsTo(db.Order, { foreignKey: "order_id", as: "order" });

// Roles -> Users (Many-to-Many)
db.Role.belongsToMany(db.User, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.User.belongsToMany(db.Role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.ROLES = ["user", "admin"];

module.exports = db;
