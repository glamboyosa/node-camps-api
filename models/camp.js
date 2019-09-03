const Joi = require("joi");
const mongoose = require("mongoose");

const Camp = mongoose.model(
  "Camp",
  new mongoose.Schema({
    name: { type: String, required: true, min: 4 },
    startDate: { type: String, required: true, max: 254 },
    endDate: { type: String, required: true, max: 254 }
  })
);

const validateCamp = camp => {
  schema = {
    name: Joi.string().min(4),
    startDate: Joi.string().min(4),
    endDate: Joi.string().min(4)
  };
  return Joi.validate(camp, schema);
};
exports.Camp = Camp;
exports.validate = validateCamp;
