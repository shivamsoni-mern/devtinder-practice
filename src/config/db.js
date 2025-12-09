const mongoose = require("mongoose");

const connectdb = async () => {
  await mongoose.connect(
    "mongodb+srv://admin:admin@cluster0.cdk3e.mongodb.net/namaste-strach"
  );
};

module.exports = connectdb;
