var models = require('../models');

module.exports = {
  get: function (req, res) { // a function which handles a get request for all messages
    models.messages.getAll()
      .then(data => {
        console.log('controllers.messages.get', data);
        res.send(data);
        res.end();
      }).catch(err => {
        throw err;
      });
  },
  post: function (req, res) { // a function which handles posting a message to the database

    models.messages.create(req.body.username, req.body.message, req.body.roomname)
      .then(data => {
        console.log('controllers.messages.post', data);
        res.end();
      }).catch(err => {
        throw err;
      });

  }
};
