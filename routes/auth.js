const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const bycrpt = require("bcrypt");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = Validate(req.body);
  if (error) res.send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = bycrpt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid or password");
  const token = user.generateAuthToken();

  res.send(token);
});
function Validate(req) {
  const schema = {
    email: Joi.string()
      .min(2)
      .max(256)
      .required()
      .email(),
    password: Joi.string()
      .min(2)
      .max(256)
      .required()
  };
  return Joi.validate(req, schema);
}
module.exports = router;
