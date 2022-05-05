var db = require('../db');
var Promise = require('bluebird');
var users = require('./users.js');

module.exports = {
  getAll: function () {
    let queryString = 'SELECT * FROM messages';

    return db.dbQuery(queryString)
      .then(data => {
        console.log('messages getall', data[0]);
        return data[0];
      }).catch(err => {
        throw err;
      });
    // db.dbConnection.query(queryString, (err, results) => {
    //   if (err) {
    //     throw err;
    //   } else {
    //     console.log(`inside messages getAll`, results);
    //     return results;
    //   }
    // });

  }, // a function which produces all the messages

  create: function (username, message, roomname) {

    return users.create(username)
      .then(() => {
        console.log('messages/models got username');
        let queryString = 'INSERT INTO messages (username, content, roomname) VALUES (?, ?, ?)';
        let queryArgs = [username, message, roomname];
        return db.dbQuery(queryString, queryArgs)
          .then(data => {
            console.log('messages create', data[0]);
          }).catch(err => {
            throw err;
          });
      }).catch(err => {
        throw err;
      });


  } // a function which can be used to insert a message into the database
};

// db.dbConnection.query(queryString, queryArgs, (err, results) => {
//   if (err) {
//     throw err;
//   } else {
//     console.log('messages create', results);
//   }
// });