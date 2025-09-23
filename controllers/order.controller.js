const db = require("../models"); // Assuming you've defined your Sequelize models in a `models` folder
const Order = db.Order; // Assuming the model is named 'OrderDetails'
const OrderImage = db.OrderImage;
const Karigar = db.Karigar;
// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      company_id,
      order_id,
      lot_weight,
      karat,
      product,
      description,
      karigar_id,
      placed_by,
      placed_date,
      delivery_date,
      status,
      client_name,
      images, // Expecting an array of image URLs
    } = req.body;

    // Create and save the order in the database
    const newOrder = await Order.create({
      order_id,
      lot_weight,
      karat,
      product,
      description,
      karigar_id,
      placed_by,
      placed_date,
      delivery_date,
      status,
      company_id,
      client_name
    });

    // Save images
    if (images && images.length > 0) {
      const imageEntries = images.map((imageUrl) => ({
        imageUrl: imageUrl,
        order_id: newOrder.order_id,
      }));
      await OrderImage.bulkCreate(imageEntries);
    }

    const createdOrder = await Order.findOne({
      where: { order_id: newOrder.order_id },
      include: [
        {
          model: OrderImage,
          as: "images", // Use the correct alias for the association
          attributes: ["id", "imageUrl"], // Adjust attributes as needed
        },
        {
          model: Karigar,
          as: "karigar", // Ensure this alias matches your association
          attributes: ["id", "name", "description"], // Adjust attributes as needed
        },
      ],
    });

    res.status(201).send(createdOrder);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the order.",
    });
  }
};

// controllers/order.controller.js
exports.getAllOrders = async (req, res) => {
  try {
    const { company_id } = req.query;
    const whereClause = company_id ? { company_id } : {};
    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: OrderImage,
          as: "images", // Use the correct alias for the association
          attributes: ["id", "imageUrl"], // Adjust attributes as needed
        },
        {
          model: Karigar,
          as: "karigar", // Ensure this alias matches what you used in your model definition
          attributes: ["id", "name", "description"], // Adjust attributes as needed
        },
      ],
    });
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving the orders.",
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const {
      order_id,
      company_id,
      lot_weight,
      karat,
      product,
      description,
      karigar_id,
      placed_by,
      placed_date,
      delivery_date,
      status,
      images, // Expecting an array of image URLs
    } = req.body;

    // Update the order details
    const [updated] = await Order.update(
      {
        lot_weight,
        karat,
        product,
        description,
        karigar_id,
        placed_by,
        placed_date,
        delivery_date,
        status,
      },
      {
        where: { order_id, company_id },
      }
    );

    if (!updated) {
      return res.status(404).send({
        message: "Order not found for the given order_id and company_id.",
      });
    }

    // If images are provided, update them
    if (images && images.length > 0) {
      await OrderImage.destroy({ where: { order_id } }); // Remove existing images
      const imageEntries = images.map((imageUrl) => ({
        imageUrl,
        order_id,
      }));
      await OrderImage.bulkCreate(imageEntries); // Bulk create new images
    }

    // Fetch the updated order, including the images and karigar details
    const updatedOrder = await Order.findOne({
      where: { order_id, company_id },
      include: [
        {
          model: OrderImage,
          as: "images", // Use the correct alias for the association
          attributes: ["id", "imageUrl"], // Adjust attributes as needed
        },
        {
          model: Karigar,
          as: "karigar", // Ensure this alias matches your model definition
          attributes: ["id", "name", "description"], // Adjust attributes as needed
        },
      ],
    });

    res.status(200).send({
      message: "Order updated successfully.",
      order: updatedOrder, // Send the updated order along with the karigar and images
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while updating the order.",
    });
  }
};

exports.deleteOrder = async (req, res) => {
  const { order_id } = req.params; // Get the order_id from request parameters

  try {
    // Check if the order exists
    const order = await Order.findOne({ where: { order_id } });
    if (!order) {
      return res.status(404).send({
        message: "Order not found.",
      });
    }

    // Delete associated images
    await OrderImage.destroy({ where: { order_id } });

    // Delete the order
    await Order.destroy({ where: { order_id } });

    res.status(200).send({
      message: "Order and associated images deleted successfully.",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while deleting the order.",
    });
  }
};
