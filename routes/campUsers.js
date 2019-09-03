const express = require('express');
const _ = require('lodash');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
const { campUsers, Validate } = require('../models/campUser');
const config = require('config');
const nodemailer = require('nodemailer');
const winston = require('winston');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ogbemudiatimothy@gmail.com',
    pass: config.get('pass')
  }
});
router.get('/', async (req, res) => {
  const campUser = await campUsers.find();
  res.send(campUser);
});
router.get('/:id', validateObjectId, async (req, res) => {
  const campUser = await campUsers.findById(req.params.id);
  res.send(campUser);
});
router.post('/', async (req, res) => {
  const { error } = Validate(req.body);
  if (error) res.status(404).send(error.details[0].message);
  let campUser = await campUsers.findOne({ email: req.body.email });
  if (campUser)
    return res.status(400).send('User with the given email already exists');
  campUser = new campUsers(
    _.pick(req.body, ['firstName', 'lastName', 'email', 'phone'])
  );

  campUser.save();
  const mailOptions = {
    from: 'ogbemudiatimothy@gmail.com', // sender address
    to: campUser.email, // list of receivers
    subject: 'Welcome to Camp!', // Subject line
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"></head><body style="width: 100%;background-color: rgb(236, 233, 233);font-size: 25px;font-family: &quot;Amatic SC&quot;, cursive;"><div class="classes" style="background-color: rgb(236, 235, 235);margin-left: 14%;width: 70%;padding: 10px 30px;text-align: center;"><h1 style="margin-top: 20px;margin-bottom: 20px;font-size: 180%;text-align: center;">Welcome to Camp Kahluahi</h1><p style="margin-top: 20px;margin-bottom: 20px;text-align: center;font-size: 150%;">Thank you for registering for camp Kahluahi  ${campUser.firstName} . <br/> We eagerly await you on the 25th of this month</p><p style="margin-top: 20px;margin-bottom: 20px;text-align: center;font-size: 150%;">Regards, camp Kahluahi family</p></div></body></html>` // plain text body
  };
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) winston.error(err);
    else winston.info(info);
  });
  res.send(campUser);
});
router.put('/:id', async (req, res) => {
  const { error } = Validate(req.body);
  if (error) res.status(404).send(error.details[0].message);

  const campUser = await campUsers.findByIdAndUpdate(
    req.params.id,

    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone
    },
    { new: true }
  );
  if (!campUser) res.sendStatus(404).send('Bad Request');
  res.send(campUser);
});
router.delete('/:id', async (req, res) => {
  const campUser = await campUsers.findByIdAndRemove(req.params.id);
  if (!campUser) return res.Status(404).send('Bad Request');
  res.send(campUser);
});
module.exports = router;
