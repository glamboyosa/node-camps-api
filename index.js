require('express-async-errors');
const express = require('express');
const app = express();
const winston = require('winston');
const Joi = require('joi');
require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/prod')(app);
require('./startup/db')();

// throw new Error("Something failed in startup");
// const p = Promise.reject(new Error("Something failed miserably"));
// p.then(() => console.log("DOne"));

//listen
const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  winston.info(`listening on port ${port}`)
);
module.exports = server;
