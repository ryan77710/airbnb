const express = require("express");
const expressFormid = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "ryan777",
  api_key: "956563211989325",
  api_secret: "fh6XdWLkFNCrwTu4Qf4MKyTPJ4A",
});

// const api_key = "b557e525dec5c2a8a86e2bae04a782c7-ba042922-9afee0ec";
// const domain =
//   "https://app.mailgun.com/app/sending/domains/sandbox28ad3ab9d21146c699ae2965a6bbd9a6.mailgun.org";
// const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

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

app.all("*", (req, res) => {
  console.log("route : *");
  res.status(400).json({ message: "this way dont existe" });
});
app.listen(3000, () => {
  console.log("server hes started ");
});
