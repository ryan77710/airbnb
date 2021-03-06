const mongoose = require("mongoose");

const Room = mongoose.model("Room", {
  picture: Array,
  location: Array,
  title: String,
  description: String,
  price: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
module.exports = Room;
