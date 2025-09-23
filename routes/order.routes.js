const express = require("express");
const { authJwt } = require("../middleware");
const orderController = require("../controllers/order.controller"); // Assuming you have an order controller

const router = express.Router();

// Middleware to add headers
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Order routes

// POST route for creating an order (requires authentication)
router.post("/", [authJwt.verifyToken], orderController.createOrder);

// GET route for fetching all orders (requires authentication)
router.get("/", [authJwt.verifyToken], orderController.getAllOrders);
router.delete(
  "/:order_id",
  [authJwt.verifyToken, authJwt.isAdmin],
  orderController.deleteOrder
);
router.put("/:order_id", [authJwt.verifyToken], orderController.updateOrder);

module.exports = router;
