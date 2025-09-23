// routes/company.routes.js
const express = require("express");
const router = express.Router();
const { authJwt } = require("../middleware");
const companyController = require("../controllers/company.controller");

// Create a new Company
router.post(
  "/",
  [authJwt.verifyToken, authJwt.isAdmin],
  companyController.createCompany
);

// Retrieve all Companies
router.get("/", [authJwt.verifyToken], companyController.getAllCompanies);

// Retrieve a single Company by ID
router.get("/:id", [authJwt.verifyToken], companyController.getCompanyById);

// Update a Company by ID
router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  companyController.updateCompany
);

// Delete a Company by ID
router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  companyController.deleteCompany
);

module.exports = router;
