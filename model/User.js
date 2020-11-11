const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  username: String,
  description: String,
  name: String,
  token: String,
  salt: String,
  hash: String,
});

module.exports = User;
