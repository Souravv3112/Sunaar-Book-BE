const express = require("express");
const {
  uploadImages,
  deleteImages,
} = require("../controllers/image.controller");
const upload = require("../middleware/uploadMiddleware");
const { authJwt } = require("../middleware");

const router = express.Router();

// POST route to upload images
router.post(
  "/upload",
  [authJwt.verifyToken],
  upload.array("images", 10),
  uploadImages
);
router.post("/delete", [authJwt.verifyToken, authJwt.isAdmin], deleteImages);

module.exports = router;
