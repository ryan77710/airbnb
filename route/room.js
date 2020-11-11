const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Room = require("../model/Room");
const isAuthentificated = require("../midelware/isAuthentificated");
const { find } = require("../model/User");

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
module.exports = router;
