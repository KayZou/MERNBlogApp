require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_secret: process.env.CLOUDINARY_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpeg", "jpg", "png"],
  params: {
    folder: "BlogProject",
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

module.exports = storage;
