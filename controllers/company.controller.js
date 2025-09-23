// controllers/company.controller.js
const db = require("../models"); // Sequelize models
const Company = db.Company; // Access the Company model
const User = db.User; // Include User model if needed
const Karigar = db.Karigar; // Include Karigar model if needed
const Order = db.Order; // Include Order model if needed

// Create and Save a new Company
exports.createCompany = async (req, res) => {
  try {
    const {
      name,
      address_line1,
      address_line2,
      city,
      state,
      country,
      postal_code,
    } = req.body;

    // Validate request
    if (!name) {
      return res.status(400).send({ message: "Company name cannot be empty!" });
    }

    // Create a Company
    const newCompany = await Company.create({
      name,
      address_line1,
      address_line2,
      city,
      state,
      country,
      postal_code,
    });

    // Send response
    res.status(201).send(newCompany);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Company.",
    });
  }
};

// Retrieve all Companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "username", "createdAt", "updatedAt"],
        },
        {
          model: Karigar,
          as: "karigars",
          attributes: ["id", "name", "description", "createdAt", "updatedAt"],
        },
        {
          model: Order,
          as: "orders",
          attributes: [
            "order_id",
            "lot_weight",
            "karat",
            "product",
            "description",
            "placed_by",
            "placed_date",
            "delivery_date",
            "status",
          ],
        },
      ],
    });

    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving Companies.",
    });
  }
};

// Retrieve a single Company by ID
exports.getCompanyById = async (req, res) => {
  const { id } = req.params;
  try {
    const company = await Company.findByPk(id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "username", "createdAt", "updatedAt"],
        },
        {
          model: Karigar,
          as: "karigars",
          attributes: ["id", "name", "description", "createdAt", "updatedAt"],
        },
        {
          model: Order,
          as: "orders",
          attributes: [
            "order_id",
            "lot_weight",
            "karat",
            "product",
            "description",
            "placed_by",
            "placed_date",
            "delivery_date",
            "status",
          ],
        },
      ],
    });

    if (!company) {
      return res.status(404).send({ message: "Company not found." });
    }

    res.status(200).send(company);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving the Company.",
    });
  }
};

// Update a Company by ID
exports.updateCompany = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    address_line1,
    address_line2,
    city,
    state,
    country,
    postal_code,
  } = req.body;

  try {
    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).send({ message: "Company not found." });
    }

    // Update company details
    company.name = name || company.name;
    company.address_line1 = address_line1 || company.address_line1;
    company.address_line2 = address_line2 || company.address_line2;
    company.city = city || company.city;
    company.state = state || company.state;
    company.country = country || company.country;
    company.postal_code = postal_code || company.postal_code;

    await company.save();

    res.status(200).send({
      message: "Company updated successfully.",
      data: company,
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while updating the Company.",
    });
  }
};

// Delete a Company by ID
exports.deleteCompany = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Company.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).send({ message: "Company not found." });
    }

    res.status(200).send({ message: "Company deleted successfully." });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while deleting the Company.",
    });
  }
};
