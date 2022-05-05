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

    const tablename = 'users'; // TODO: fill this out
    const tablename2 = 'messages'; // TODO: fill this out
    const tablename3 = 'rooms'; // TODO: fill this out

    /* Empty the db table before all tests so that multiple tests
     * (or repeated runs of the tests)  will not fail when they should be passing
     * or vice versa */
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
    // Create a user on the chat server database.
    axios.post(`${API_URL}/users`, { username })
      .then(() => {
        // Post a message to the node chat server:
        return axios.post(`${API_URL}/messages`, { message, username, roomname });
      })
      .then(() => {
        // Now if we look in the database, we should find the posted message there.

        /* TODO: You might have to change this test to get all the data from
         * your message table, since this is schema-dependent. */
        const queryString = 'SELECT * FROM messages WHERE content=? AND username=? AND roomname=?'; // do we need to return just a row or can we return the whole table? since presumably we will only have one row of data after the before() call.
        const queryArgs = [message, username, roomname];

        dbConnection.query(queryString, queryArgs, (err, results) => {
          if (err) {
            throw err;
          }
          // Should have one result:
          expect(results.length).toEqual(1);

          // TODO: If you don't have a column named text, change this test.
          expect(results[0].content).toEqual(message);
          done();
        });
      })
      .catch((err) => {
        throw err;
      });
  });

  it('Should output all messages from the DB', (done) => {
    // Let's insert a message into the db
    const username = 'Huckleberry';
    const message = 'Jim!';
    const roomname = 'Comeback';
    /* TODO: The exact query string and query args to use here
    * depend on the schema you design, so I'll leave them up to you. */

    axios.post(`${API_URL}/users`, { username })
      .then(() => {
        // Post a message to the node chat server:
        return axios.post(`${API_URL}/messages`, { message, username, roomname });
      })
      .then(() => {

        const queryString = 'SELECT * FROM messages';
        const queryArgs = [];
        dbConnection.query(queryString, (err) => {
          if (err) {
            throw err;
          }

          // Now query the Node chat server and see if it returns the message we just inserted:
          axios.get(`${API_URL}/messages`)
            .then((response) => {
              const messageLog = response.data;
              console.log('messageLog', messageLog);
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

  it('JOY TEST', (done) => {
    // Let's insert a message into the db
    const username = 'Huckleberry';
    const message = 'I love Mark Twain';
    const roomname = 'Hello';
    /* TODO: The exact query string and query args to use here
    * depend on the schema you design, so I'll leave them up to you. */

    axios.post(`${API_URL}/users`, { username })
      .then(() => {
        // Post a message to the node chat server:
        return axios.post(`${API_URL}/messages`, { message, username, roomname });
      })
      .then(() => {

        const queryString = 'SELECT username FROM users';
        // const queryArgs = [];
        dbConnection.query(queryString, (err) => {
          if (err) {
            throw err;
          }

          // Now query the Node chat server and see if it returns the message we just inserted:
          axios.get(`${API_URL}/users`)
            .then((response) => {
              const messageLog = response.data;
              console.log('messageLog', messageLog);
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
    // Let's insert a message into the db
    const username = 'CaptainNemo';
    const message = 'That\'s a big fish!';
    const roomname = 'UnderTheSea';
    /* TODO: The exact query string and query args to use here
    * depend on the schema you design, so I'll leave them up to you. */
    // Post a message to the node chat server:
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
