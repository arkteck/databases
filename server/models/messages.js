var db = require('../db');

module.exports = {
  getAll: function () {
    let queryString = 'SELECT * FROM messages';
    db.dbConnection.query(queryString, (err, results) => {
      if (err) {
        throw err;
      } else {
        console.log(`inside messages getAll ${results}`);
        return results;
      }
    });

  }, // a function which produces all the messages

  create: function (username, message, roomname) {
    let queryString = 'INSERT INTO messages (username, content, roomname) VALUES (?, ?, ?)';
    let queryArgs = [username, message, roomname];
    db.dbConnection.query(queryString, queryArgs, (err, results) => {
      if (err) {
        throw err;
      } else {
        console.log('messages create', results);
      }
    });
  } // a function which can be used to insert a message into the database
};
