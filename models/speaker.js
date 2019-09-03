const mongoose = require("mongoose");
const Joi = require("joi");
const speakerSchema = new mongoose.Schema({
  fullname: { type: String, required: true }
});
const Speaker = mongoose.model("Speaker", speakerSchema);
exports.Speaker = Speaker;
exports.speakerSchema = speakerSchema;
