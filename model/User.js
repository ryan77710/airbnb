const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  username: String,
  description: String,
  name: String,
  token: String,
  salt: String,
  hash: String,
  account: {
    photo: { url: { type: mongoose.Schema.Types.Mixed }, picture_id: String },
  },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
  tokentemp: String,
  dateNow: Number,
});

module.exports = User;
