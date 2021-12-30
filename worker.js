const RequestParser = require('./RequestParser');
const makeResponse = require('./makeResponse');
const path = require('path');

const CORSPlugin = require('./CORSPlugin');
const OPTIONSPlugin = require('./OPTIONSPlugin');
const AUTHPlugin = require('./AUTHPlugin');

const CACHEPlugin = require('./CACHEPlugin');

const POSTPlugin = require('./POSTPlugin');
const GETPlugin = require('./GETPlugin');
const PUTPlugin = require('./PUTPlugin');
const DELETEPlugin = require('./DELETEPlugin');

module.exports = (connection) => {

  const parser = new RequestParser();
  const env = {
    root: path.resolve('./www'),
    session: path.resolve('./session')
  };

  connection.on('data', (buffer) => {
    parser.append(buffer);
  });

  parser.on('finish', (message) => {
    // plugin 0
    message = CORSPlugin(message, env);
    message = OPTIONSPlugin(message, env);
    message = AUTHPlugin(message, env);

    message = CACHEPlugin(message, env);

    message = POSTPlugin(message, env);
    message = GETPlugin(message, env);
    message = PUTPlugin(message, env);
    message = DELETEPlugin(message, env);
    // make reqsonse
    connection.end(makeResponse(message));
  })
}
