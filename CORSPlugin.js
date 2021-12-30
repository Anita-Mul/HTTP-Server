const helper = require('./helper');

module.exports = function (message, env) {

  if (message.response.status) {
    return message;
  }

  if (message.request.path.indexOf('.') === 0) {
    message.response.status = 403;
    return message;
  }

  helper.setHeader(message.response.headers, 'Access-Control-Allow-Origin', 'http://a.com');
  helper.setHeader(message.response.headers, 'Access-Control-Allow-Credentials', 'true');

  return message;
}
