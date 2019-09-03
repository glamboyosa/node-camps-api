const Joi = require("joi");
const { speakerSchema } = require("./speaker");
const mongoose = require("mongoose");

const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 2,
      max: 256
    },
    speaker: { type: speakerSchema, required: true },
    venue: {
      type: String,
      required: true,
      min: 3,
      max: 256
    }
  })
);
function validateEvent(event) {
  const schema = {
    name: Joi.string()
      .required()
      .min(2),
    speakerId: Joi.string().required(),
    venue: Joi.string()
      .required()
      .min(3)
      .max(256)
  };
  return Joi.validate(event, schema);
}
exports.Event = Event;
exports.Validate = validateEvent;
