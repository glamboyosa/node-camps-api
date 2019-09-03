const mongoose = require("mongoose");
const Joi = require("joi");
const Roles = mongoose.model(
  "Role",
  new mongoose.Schema({
    role: { type: String, minlength: 3, max: 256 }
  })
);

//for joi validation
validateRole = role => {
  const schema = {
    role: Joi.string()
      .min(3)
      .max(256)
  };
  console.log(Joi.validate(role, schema));
  return Joi.validate(role, schema);
};
exports.Roles = Roles;
exports.Validate = validateRole;
