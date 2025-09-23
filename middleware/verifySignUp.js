const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsername = (req, res, next) => {
  // Check for duplicate username
  const { username } = req.body;
  User.findOne({
    where: {
      username,
    },
  })
    .then((user) => {
      if (user) {
        // Username already exists
        res.status(400).send({
          message: "Failed! Username is already in use!",
        });
        return;
      }

      // Proceed to the next middleware or route handler
      next();
    })
    .catch((err) => {
      // Handle any errors that occur during the database query
      res.status(500).send({
        message: "Error checking for duplicate username",
      });
    });
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i],
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsername,
  checkRolesExisted,
};

module.exports = verifySignUp;
