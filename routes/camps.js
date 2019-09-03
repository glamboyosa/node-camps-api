const { Camp, Validate } = require("../models/camp");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
router.get("/", async (req, res) => {
  const camp = await Camp.find();
  res.send(camp);
});

//MOST LIKELY WILL REPLACE THIS POST METHOD WITH A METHOD THAT SEEDS THE MONGO DATABASE. JUST CURRENTLY IMPLEMENTING POST
//BECAUSE OF TESTING REASONS
router.post("/", async (req, res) => {
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const camp = new Camp({
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  });
  await camp.save();
  res.send(camp);
});
router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const camp = await Camp.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  });
});
//I WONT IMPLEMENT A DELETE METHOD, JUST DELETE FROM MONGODB
