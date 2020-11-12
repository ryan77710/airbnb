const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Room = require("../model/Room");
const isAuthentificated = require("../midelware/isAuthentificated");
const { find } = require("../model/User");
const uid2 = require("uid2");
const cloudinary = require("cloudinary").v2;

router.post("/room/publish", isAuthentificated, async (req, res) => {
  console.log("route: /room/publish");
  try {
    const { title, description, price } = req.fields;
    const newRoom = new Room({
      title: title,
      description: description,
      price: price,
      user: req.user.id,
    });
    newRoom.location.push(req.fields.location.lat);
    newRoom.location.push(req.fields.location.lng);

    newRoom.save();

    res.status(200).json(newRoom);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/rooms/", isAuthentificated, async (req, res) => {
  console.log("route:/rooms");
  try {
    const find = await Room.findById(req.query.id);
    res.status(200).json(find);
  } catch (error) {
    console.log(error.message);
  }
});

router.put("/room/update/:id", isAuthentificated, async (req, res) => {
  console.log("route: /room/update/:id");

  const { title, description, price } = req.fields;
  try {
    const find = await Room.findById(req.params.id);
    if (title) {
      find.title = title;
    }

    if (description) {
      find.description = description;
    }
    if (price) {
      find.price = price;
    }
    if (req.fields.location) {
      find.location[0] = req.fields.location.lat;
      find.location[1] = req.fields.location.lng;
    }
    find.markModified("location");
    find.save();
    res.status(200).json("room update");
  } catch (error) {
    console.log(error.message);
  }
});

router.delete("/room/delete/:id", isAuthentificated, async (req, res) => {
  console.log("route:room/delete/:id");
  try {
    const find = await Room.findById(req.params.id);

    find.deleteOne();
    res.status(200).json({ message: "room deleted" });
  } catch (error) {
    console.log(error.message);
  }
});
router.put("/room/upload_picture/:id", isAuthentificated, async (req, res) => {
  console.log("route: /room/upload_picture/:id");

  const find = await Room.findById(req.params.id);
  const publicId = uid2(10);

  if (find.picture.length <= 4) {
    const picture = req.files.picture.path;
    const result = await cloudinary.uploader.upload(picture, {
      folder: `/airbnb/room/${find.id}`,
      public_id: `${publicId}`,
    });
    const obj = {};
    obj.url = result.secure_url;
    obj.picture_id = publicId;
    find.picture.push(obj);
    //console.log(find);
    find.markModified("picture");
    find.save();

    res.status(200).json({ message: "okk" });
  } else {
    res.status(400).json({ message: "impossible to have more to 5 picture" });
  }
});
router.delete(
  "/room/delete_picture/:id",
  isAuthentificated,
  async (req, res) => {
    console.log("route : /room/delete_picture/:id");
    try {
      const find = await Room.findById(req.params.id);
      const deletepic = await cloudinary.api.delete_resources_by_prefix(
        `airbnb/room/${req.params.id}/${req.fields.picture_id}`
      );

      const tab1 = [];
      const tab = find.picture;
      console.log(tab[0].picture_id);
      for (let i = 0; i < tab.length; i++) {
        if (tab[i].picture_id === req.fields.picture_id) {
        } else {
          tab1.push(tab[i]);
        }
      }
      find.picture = tab1;
      find.markModified("picture");
      find.save();
      //console.log(tab1);
      res.status(200).json({ message: "picture deleted" });
    } catch (error) {
      console.log(error.message);
    }
  }
);
module.exports = router;
