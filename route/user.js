const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Room = require("../model/Room");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const isAuthentificated = require("../midelware/isAuthentificated");
const cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: "ryan777",
//   api_key: "956563211989325",
//   api_secret: "fh6XdWLkFNCrwTu4Qf4MKyTPJ4A",
// });
router.post("/sign-up", async (req, res) => {
  console.log("route: /sign-up");
  try {
    const { email, username, description, name, password } = req.fields;
    const find = await User.findOne({ email: email });
    if (find) {
      res.status(400).json({ message: "This email already has an account." });
    } else {
      if (!email || !username || !description || !name || !password) {
        res.status(400).json({ message: "Missing parameters" });
      } else {
        const newUser = new User({
          email: email,
          username: username,
          description: description,
          name: name,
        });

        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(password + salt).toString(encBase64);
        newUser.hash = hash;
        newUser.token = token;
        newUser.salt = salt;
        await newUser.save();
        const new1 = await User.find(newUser).select(
          "email token username name description"
        );
        console.log("account user created");

        res.status(200).json(new1);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/log-in", async (req, res) => {
  console.log("route : /log-in");
  const { password, email } = req.fields;
  try {
    const find = await User.findOne({ email: email });
    if (!find) {
      res.status(400).json({ message: "Unauthorized" });
    } else {
      const hashToCompare = SHA256(password + find.salt).toString(encBase64);
      if (hashToCompare === find.hash) {
        res.status(200).json({ message: "welcome" });
      } else {
        res.status(400).json({ message: "Unautorized" });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
});
router.put("/user/upload_picture/:id", isAuthentificated, async (req, res) => {
  console.log("route: /user/upload_picture/:id");
  try {
    const find = await User.findById(req.params.id).select(
      "account username description name id email rooms"
    );
    const pictures = req.files.picture.path;
    const result = await cloudinary.uploader.upload(pictures, {
      folder: `airbnb/user/${req.params.id}`,
    });
    find.account.photo.url = result.secure_url;
    find.account.photo.picture_id = result.public_id;
    find.save();

    res.status(200).json(find);
  } catch (error) {
    console.log(error.message);
  }
});

router.delete(
  "/user/delete_picture/:id",
  isAuthentificated,
  async (req, res) => {
    console.log("route : /user/delete_picture/:id");
    try {
      const find = await User.findById(req.params.id);
      const deletePic = await cloudinary.api.delete_resources_by_prefix(
        `airbnb/user/${req.params.id}`
      );

      find.account.photo = null;
      find.save();
      res.status(200).json({ message: "ok" });
    } catch (error) {
      console.log(error.message);
    }
  }
);

module.exports = router;
