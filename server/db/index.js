var mysql = require('mysql2');
var Promise = require('bluebird');

const API_URL = 'http://127.0.0.1:3000/classes';

var Sequelize = require('sequelize');
var dbConnection = new Sequelize('chat', 'root', '', {dialect: 'mysql'});

var dbUserQuery = dbConnection.define('users', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
}, {timestamps: false});

var dbMessageQuery = dbConnection.define('messages', {
  content: Sequelize.STRING,
  username: Sequelize.STRING,
  roomname: Sequelize.STRING
}, {timestamps: false});

module.exports = {
  dbConnection, API_URL, dbUserQuery, dbMessageQuery
};