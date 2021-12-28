const RequestParser = require('./RequestParser');
const makeResponse = require('./makeResponse');

module.exports = (connection) => {

  const parser = new RequestParser();

  connection.on('data', (buffer) => {
    parser.append(buffer);
  });

  parser.on('finish', (message) => {
    // plugin 0
    // ...
    // make reqsonse
    connection.end(makeResponse(message));
  })
}
