var db = require('../db');
var Promise = require('bluebird');
var users = require('./users.js');

module.exports = {
  getAll: function () {

    return db.dbMessageQuery.sync()
      .then(function () {
        return db.dbMessageQuery.findAll();
      })
      .then(function(messages) {
        return messages;
      })
      .catch(function(err) {
        throw err;
      });
  },

  create: function (username, content, roomname) {

    return users.create(username)
      .then(() => {
        return db.dbMessageQuery.sync();
      })
      .then(() => {
        return db.dbMessageQuery.create({username, content, roomname});
      }).catch(err => {
        throw err;
      });
  }
};

