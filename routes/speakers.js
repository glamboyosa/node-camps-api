const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const mongoose = require("mongoose");
const { Speaker } = require("../models/speaker");
router.get("/", async (req, res) => {
  const speaker = await Speaker.find();
  res.send(speaker);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const speaker = await Speaker.findById(req.params.id);
  if (!speaker) res.send("Error handling request");
  res.send(speaker);
});
router.post("/", [auth], async (req, res) => {
  let speaker = new Speaker({
    fullname: req.body.fullname
  });
  await speaker.save();
  res.send(speaker);
});
router.put("/:id", [auth, admin], async (req, res) => {
  const speaker = await Speaker.findByIdAndUpdate(
    req.params.id,
    { fullname: req.body.fullname },
    { new: true }
  );

  if (!speaker) res.status(404).send("Not Found");
  res.send(speaker);
});
router.delete("/:id", [auth, admin], async (req, res) => {
  const speaker = await Speaker.findByIdAndDelete(req.params.id);
  if (!speaker) res.status(404).send("Not Found");
  res.send(speaker);
});
module.exports = router;
