const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_DB_URI).then(() => {
  console.log("connected to MongoDB");
});
module.exports = mongoose.connection;