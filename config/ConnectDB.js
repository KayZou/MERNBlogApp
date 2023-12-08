require("dotenv").config();
const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    await mongoose
      .connect(process.env.DB_CONNECTION_STRING)
      .then(() => {
        console.log("✔ Connected to MongoDB!");
      })
      .catch((error) => {
        console.log(`error: ${error.message || error}`);
      });
  } catch (error) {
    console.error("Cannot connect to MongoDB!");
  }
};

module.exports = ConnectDB;
