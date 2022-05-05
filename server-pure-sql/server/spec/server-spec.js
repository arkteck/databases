/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

const mysql = require('mysql2');
const axios = require('axios');

const API_URL = 'http://127.0.0.1:3000/classes';

describe('Persistent Node Chat Server', () => {
  const dbConnection = mysql.createConnection({
    user: 'root',
    password: '',
    database: 'chat',
  });

  beforeAll((done) => {
    dbConnection.connect();

    const tablename = 'users';
    const tablename2 = 'messages';
    const tablename3 = 'rooms';

    dbConnection.query(`truncate ${tablename}`, done);
    dbConnection.query(`truncate ${tablename2}`, done);
    dbConnection.query(`truncate ${tablename3}`, done);
  }, 6500);

  afterAll(() => {
    dbConnection.end();
  });

  it('Should insert posted messages to the DB', (done) => {
    const username = 'Valjean';
    const message = 'In mercy\'s name, three days is all I need.';
    const roomname = 'Hello';

    axios.post(`${API_URL}/users`, { username })
      .then(() => {
        return axios.post(`${API_URL}/messages`, { message, username, roomname });
      })
      .then(() => {
        const queryString = 'SELECT * FROM messages WHERE content=? AND username=? AND roomname=?';
        const queryArgs = [message, username, roomname];

        dbConnection.query(queryString, queryArgs, (err, results) => {
          if (err) {
            throw err;
          }
          expect(results.length).toEqual(1);
          expect(results[0].content).toEqual(message);
          done();
        });
      })
      .catch((err) => {
        throw err;
      });
  });

  it('Should output all messages from the DB', (done) => {

    const username = 'Huckleberry';
    const message = 'Jim!';
    const roomname = 'Comeback';

    axios.post(`${API_URL}/users`, { username })
      .then(() => {
        return axios.post(`${API_URL}/messages`, { message, username, roomname });
      })
      .then(() => {

        const queryString = 'SELECT * FROM messages';
        const queryArgs = [];
        dbConnection.query(queryString, (err) => {
          if (err) {
            throw err;
          }

          axios.get(`${API_URL}/messages`)
            .then((response) => {
              const messageLog = response.data;
              expect(messageLog[messageLog.length - 1].content).toEqual(message);
              expect(messageLog[messageLog.length - 1].roomname).toEqual(roomname);
              done();
            })
            .catch((err) => {
              throw err;
            });
        });
      });
  });

  it('Should not add new username if username already exists', (done) => {

    const username = 'Huckleberry';
    const message = 'I love Mark Twain';
    const roomname = 'Hello';

    axios.post(`${API_URL}/users`, { username })
      .then(() => {
        return axios.post(`${API_URL}/messages`, { message, username, roomname });
      })
      .then(() => {

        const queryString = 'SELECT username FROM users';
        dbConnection.query(queryString, (err) => {
          if (err) {
            throw err;
          }

          axios.get(`${API_URL}/users`)
            .then((response) => {
              const messageLog = response.data;
              var counter = 0;
              for (var i = 0; i < messageLog.length; i++) {
                if (messageLog[i] === username) {
                  counter++;
                }
              }
              expect(counter).toEqual(1);
              done();
            })
            .catch((err) => {
              throw err;
            });
        });
      });
  });


  it('Should add username to database from message post if username does not exist', (done) => {

    const username = 'CaptainNemo';
    const message = 'That\'s a big fish!';
    const roomname = 'UnderTheSea';

    axios.post(`${API_URL}/messages`, { message, username, roomname })
      .then(() => {
        return axios.get(`${API_URL}/users`);
      }).then((response) => {
        expect(response.data.includes(username)).toEqual(true);
        done();
      }).catch((err) => {
        throw err;
      });

  });


});
