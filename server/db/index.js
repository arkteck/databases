var mysql = require('mysql2');
var Promise = require('bluebird'); // maybe don't need

// Create a database connection and export it from this file.
// Confirm that the credentials supplied for the connection are correct.
// On Campus at pairing stations you'll use
// user: 'student', password: 'student'
// On your personal computer supply the correct credentials for your mySQL account -- likely
// user: 'root', password: ''
// OR
// user: 'root', password: 'some_password_you_created_at_install'


const API_URL = 'http://127.0.0.1:3000/classes';
const dbConnection = mysql.createConnection({
  user: 'root',
  password: '',
  database: 'chat',
});

dbConnection.connect();

const dbQuery = (...args) => {
  return new Promise((resolve, request) => {
    dbConnection.query(...args, (err, ...data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  dbConnection, API_URL, dbQuery
};