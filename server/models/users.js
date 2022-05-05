var db = require('../db');

module.exports = {
  getAll: function () {
    let queryString = 'SELECT username FROM users';
    db.dbConnection.query(queryString, (err, results) => {
      if (err) {
        throw err;
      } else {
        console.log(`inside users getAll ${results}`);
        return results;
      }
    });
  },

  create: function (username, password) {
    let queryString = 'INSERT INTO users (username, password) VALUES (?, ?)';
    let queryArgs = [username, password];
    db.dbConnection.query(queryString, queryArgs, (err, results) => {
      if (err) {
        throw err;
      } else {
        console.log('users create', results);
      }
    });
  }
};