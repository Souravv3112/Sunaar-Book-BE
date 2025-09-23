const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3.config");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Helper function to get today's date in the format YYYYMMDD
const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

// Uploads a file to S3 and returns the URL
const uploadImageToS3 = async (file, order_id) => {
  const fileExtension = path.extname(file.originalname);
  const uniqueFileName = `IMG-${getFormattedDate()}-${uuidv4()}${fileExtension}`;

  const bucketName = process.env.S3_BUCKET_NAME;

  // Create the S3 key in the format order_id/IMG-today's date-filename
  const s3Key = `${order_id}/${uniqueFileName}`;

  const params = {
    Bucket: bucketName,
    Key: s3Key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    return imageUrl;
  } catch (error) {
    throw new Error("S3 Upload Error: " + error.message);
  }
};

// Deletes a file from S3 given its URL
const deleteImageFromS3 = async (imageUrl) => {
  const bucketName = process.env.S3_BUCKET_NAME;
  const s3Key = imageUrl.split(".com/")[1]; // Extract the S3 key from the URL

  if (!s3Key) {
    throw new Error("Invalid image URL");
  }

  const params = {
    Bucket: bucketName,
    Key: s3Key,
  };

  try {
    await s3.send(new DeleteObjectCommand(params));
    console.log(`Deleted image: ${s3Key}`);
  } catch (error) {
    throw new Error("S3 Delete Error: " + error.message);
  }
};

module.exports = { uploadImageToS3, deleteImageFromS3 };
