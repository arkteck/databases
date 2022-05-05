var db = require('../db');

module.exports = {
  getAll: function () {

    return db.dbUserQuery.sync()
      .then(function() {
        return db.dbUserQuery.findAll();
      })
      .then(function(users) {
        let userArray = [];
        users.forEach(user => {
          userArray.push(user.username);
        });
        return userArray;
      })
      .catch(err => {
        throw err;
      });
  },

  create: function (username, password) {

    return db.dbUserQuery.sync()
      .then(function() {
        return module.exports.getAll();
      })
      .then(function(users) {
        if (users.includes(username)) {
        } else {
          return db.dbUserQuery.create({username, password});
        }
      })
      .catch(function(err) {
        throw err;
      });
  }
};