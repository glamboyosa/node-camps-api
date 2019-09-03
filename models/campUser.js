const mongoose = require("mongoose");
const Joi = require("joi");

const campUsers = mongoose.model(
  "campUser",
  new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true }
  })
);
//for Joi validation
validateCampUsers = campUsers => {
  const schema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    phone: Joi.string().required()
  };
  return Joi.validate(campUsers, schema);
};
exports.campUsers = campUsers;
exports.Validate = validateCampUsers;
