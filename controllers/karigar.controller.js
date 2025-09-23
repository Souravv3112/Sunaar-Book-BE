const db = require("../models"); // Assuming your Sequelize models are in the 'models' folder
const Karigar = db.Karigar; // Access the Karigar model

// Create and Save a new Karigar
exports.createKarigar = async (req, res) => {
  try {
    const { name, description, company_id } = req.body;

    // Validate request
    if (!name) {
      return res.status(400).send({ message: "Name cannot be empty!" });
    }

    // Create a Karigar
    const newKarigar = await Karigar.create({
      name,
      description,
      company_id
    });

    // Send response
    res.status(201).send(newKarigar);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Karigar.",
    });
  }
};

// controllers/karigar.controller.js
exports.getAllKarigars = async (req, res) => {
  try {
    const { company_id } = req.query;
    const whereClause = company_id ? { company_id } : {};
    const karigars = await Karigar.findAll({
      where: whereClause,
      include: [
        {
          model: db.Order,
          as: "orders", // Use the correct alias for the association
          attributes: [
            "order_id",
            "company_id",
            "lot_weight",
            "karat",
            "description",
            "placed_by",
            "placed_date",
            "delivery_date",
            "status",
          ],
        },
      ],
    });
    res.status(200).send(karigars);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving Karigars.",
    });
  }
};

exports.updateKarigar = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const karigar = await Karigar.findByPk(id);

    if (!karigar) {
      return res.status(404).send({
        message: "Karigar not found.",
      });
    }

    // Update karigar details
    karigar.name = name || karigar.name;
    karigar.description = description || karigar.description;

    await karigar.save();

    res.status(200).send({
      message: "Karigar updated successfully.",
      data: karigar,
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while updating the karigar.",
    });
  }
};

// Delete a karigar by ID
exports.deleteKarigar = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Karigar.destroy({
      where: { id },
    });

    if (result === 0) {
      return res.status(404).send({
        message: "Karigar not found.",
      });
    }

    res.status(200).send({
      message: "Karigar deleted successfully.",
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while deleting the karigar.",
    });
  }
};
