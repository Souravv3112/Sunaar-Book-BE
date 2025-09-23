const express = require("express");
const { verifySignUp, authJwt } = require("../middleware");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post(
  "/signup",
  [
    verifySignUp.checkRolesExisted,
    authJwt.verifyToken,
    authJwt.isAdmin,
  ],
  authController.signup
);

router.post("/signin", authController.signin);

router.post("/generate-hash", authController.generateHash);

router.put(
  "/users/:userId",
  [authJwt.verifyToken, authJwt.isAdmin],
  authController.updateUser
);
router.delete(
  "/users/:userId",
  [authJwt.verifyToken, authJwt.isAdmin],
  authController.deleteUser
);
router.get(
  "/users",
  [authJwt.verifyToken, authJwt.isAdmin],
  authController.getAllUsers
);

module.exports = router;
