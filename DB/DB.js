const mongoose = require("mongoose");

const connectDB = mongoose.connect(
  "mongodb+srv://chetan:chauhan@cluster0.xx5g40u.mongodb.net/kesari?retryWrites=true&w=majority&appName=Cluster0"
);

module.exports = connectDB;
