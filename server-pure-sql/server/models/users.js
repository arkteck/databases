var db = require('../db');

module.exports = {
  getAll: function () {
    let queryString = 'SELECT username FROM users';
    return db.dbQuery(queryString)
      .then(data => {
        console.log('users getall', data[0]);
        let userArray = [];
        data[0].forEach(user => {
          userArray.push(user.username);
        });
        return userArray;
      }).catch(err => {
        throw err;
      });
  },

  create: function (username, password) {

    return this.getAll()
      .then(data => {
        if (data.includes(username)) {
          console.log('user ' + username + ' already exists');
        } else {

          let queryString = 'INSERT INTO users (username, password) VALUES (?, ?)';
          let queryArgs = [username, password];
          return db.dbQuery(queryString, queryArgs)
            .then(data => {
              console.log('users models create', data[0]);
            }).catch(err => {
              throw err;
            });
        }
      }).catch(err => {
        throw err;
      });
  }
};
