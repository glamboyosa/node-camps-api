const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const { Speaker } = require("../models/speaker");
const { Event, Validate } = require("../models/event");

router.get("/", async (req, res) => {
  const event = await Event.find();
  res.send(event);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) res.Status(404).send("Not Found");
  res.send(event);
});
router.post("/", [auth], async (req, res) => {
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const speaker = await Speaker.findById(req.body.speakerId);
  if (!speaker) return res.status(400).send("Speaker not found");

  const event = new Event({
    name: req.body.name,
    speaker: {
      _id: speaker._id,
      fullname: speaker.fullname
    },

    venue: req.body.venue
  });
  await event.save();
  res.send(event);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const speaker = await Speaker.findById(req.body.speakerId);
  if (!speaker) return res.status(400).send("Speaker not found");

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      speaker: {
        _id: speaker._id,
        name: speaker.fullname
      },
      venue: req.body.venue
    },
    { new: true }
  );
  if (!event)
    return res
      .status(404)
      .send("The Event with the given status was not found");
  res.send(event);
});
router.delete("/:id", [auth, admin], async (req, res) => {
  const event = await Event.findByIdAndRemove(req.params.id);
  if (!event)
    return res.status(404).send("The Event with the given ID was not found");
  res.send(event);
});
module.exports = router;
