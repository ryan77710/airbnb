const express = require("express");
const expressFormid = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "ryan777",
  api_key: "956563211989325",
  api_secret: "fh6XdWLkFNCrwTu4Qf4MKyTPJ4A",
});

app = express();
app.use(expressFormid());

mongoose.connect("mongodb://localhost/airbnb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const appRoute = require("./route/user");
app.use(appRoute);

const appRoom = require("./route/room");
app.use(appRoom);
app.listen(3000, () => {
  console.log("server hes started ");
});
