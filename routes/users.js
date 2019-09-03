const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const bcrypt = require("bcrypt");
const { User, Validate } = require("../models/user");
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});
router.post("/", [auth, admin], async (req, res) => {
  const { error } = Validate(req.body);
  if (error) res.send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(404).send("Email already in use");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  //WE SET RESPONSE HEADERS JUST INCASE OUR APP DOES NOT NECESSARILY NEED LOGIN SO IT ALREADY HAS JWT TOKEN TO BE USED
  // const token = user.generateAuthToken();

  // res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
  res.send(_.pick(user, ["name", "email"]));
});

module.exports = router;
