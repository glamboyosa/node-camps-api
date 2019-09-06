const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 50
  },
  email: {
    type: String,
    required: true,
    min: 2,
    max: 256,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 2,
    max: 1024
  },
  isAdmin: Boolean
});
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, email: this.email, isAdmin: this.isAdmin },
    config.get('jwtPrivateKey')
  );
  return token;
};
const User = mongoose.model('User', userSchema);

function validate(user) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    email: Joi.string()
      .min(2)
      .max(256)
      .required()
      .email(),
    password: Joi.string()
      .min(2)
      .max(256)
      .required(),
    isAdmin: Joi.boolean()
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.Validate = validate;
