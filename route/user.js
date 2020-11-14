const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Room = require("../model/Room");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const isAuthentificated = require("../midelware/isAuthentificated");
const { findOne } = require("../model/User");
const cloudinary = require("cloudinary").v2;
const api_key = "b557e525dec5c2a8a86e2bae04a782c7-ba042922-9afee0ec";
const domain = "sandbox28ad3ab9d21146c699ae2965a6bbd9a6.mailgun.org";
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

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
router.get("/users/:id", async (req, res) => {
  console.log("route : /users/:id");
  const find = await User.findById(req.params.id).select(
    "_id account username name description photo rooms"
  );
  res.status(200).json(find);
  try {
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/user/rooms/:id", async (req, res) => {
  console.log("route: /user/rooms/:id");
  try {
    const find = await Room.find({ user: req.params.id });
    res.status(200).json(find);
  } catch (error) {
    console.log(error.message);
  }
});

router.put("/user/update", isAuthentificated, async (req, res) => {
  console.log("route : /user/update");
  try {
    const find = await User.findOne(req.user);
    const { email, name, description, username } = req.fields;
    if (email) {
      find.email = req.fields.email;
    }
    if (name) {
      find.name = req.fields.name;
    }
    if (description) {
      find.description = req.fields.description;
    }
    if (username) {
      find.username = req.fields.username;
    }

    console.log(find);
    find.save();
    res.status(200).json(find);
  } catch (error) {
    console.log(error.message);
  }
});

router.put("/user/update_password", async (req, res) => {
  console.log("route : /user/update_password");
  try {
    const email = req.fields.email;
    const find = await User.findOne({ email: email });
    const tokentemp = uid2(64);
    const dateNow = Date.now();
    find.tokentemp = tokentemp;
    find.dateNow = dateNow;
    find.save();

    //console.log("send email with tokentemp and link", tokentemp);

    let data = {
      from: "gg <ryanlollia77@gmail.com>",
      to: "ryanlollia77@gmail.com",
      subject: "Hello",
      text: "your going to be modify reset it whith the link",
    };

    mailgun.messages().send(data, (error, body) => {
      // mailgun ne s'affiche pas en vert
      console.log(body); // me renvoi "indefined" en error et body
    });
    res.status(200).json({ message: "A link has been sent to the user" });
  } catch (error) {
    console.log(error.message);
  }
});

router.put("/user/reset_password/", async (req, res) => {
  console.log("route : //user/reset_password/");
  try {
    const find = await User.findOne({ tokentemp: req.fields.tokentemp });
    const dateLast = find.dateNow + 900000;
    const datenow = Date.now();

    if (datenow > dateLast) {
      res.status(400).json({ message: "you have 15 min for change password" });
    } else {
      const salt = uid2(64);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);
      find.salt = salt;
      find.hash = hash;
      find.dateNow = undefined;
      find.tokentemp = undefined;
      find.save();
      res.status(200).json({ message: "password change" });
    }
  } catch (error) {
    console.log(error.message);
  }
});
router.delete("/user/delete", isAuthentificated, async (req, res) => {
  console.log("route : /user/delete");
  try {
    const find = await User.findById(req.fields.id);
    const tab = find.rooms;
    for (let i = 0; i < tab.length; i++) {
      console.log(tab[i]);
      const deletee = await Room.findById(tab[i]);
      if (deletee) {
        deletee.deleteOne();
      } else {
      }
    }
    find.deleteOne();

    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    console.log(error.message);
  }
});
module.exports = router;
