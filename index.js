const express = require("express");
const expressFormid = require("express-formidable");
const mongoose = require("mongoose");

app = express();
app.use(expressFormid());

mongoose.connect("mongodb://localhost/airbnb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const appRoute = require("./route/user");
app.use(appRoute);
app.listen(3000, () => {
  console.log("server hes started ");
});
