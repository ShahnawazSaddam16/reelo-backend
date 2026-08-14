require("dotenv").config();
const mongoose = require("mongoose");

const dbConnection = () => {
  return mongoose.connect(process.env.MONGO_URI, {});
};

dbConnection()
  .then(() => {
    console.log("MongoDB Connected Successfully ✅✅");
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = dbConnection;
