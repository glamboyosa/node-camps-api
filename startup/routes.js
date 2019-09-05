const express = require('express');
const camps = require('../routes/camps');
const roles = require('../routes/roles');
const speakers = require('../routes/speakers');
const events = require('../routes/events');
const users = require('../routes/users');
const auth = require('../routes/auth');
const campUsers = require('../routes/campUsers');
const error = require('../middleware/error');
module.exports = function(app) {
  //routes
  app.use(express.json());
  app.use('/api/roles', roles);
  app.use('/api/speakers', speakers);
  app.use('/api/camps', camps);
  app.use('/api/campusers', campUsers);
  app.use('/api/events', events);
  app.use('/api/users', users);
  app.use('/api/login', auth);
  app.use(error);
};
