const fs = require("fs");
const path = require("path");

module.exports = function (message, env) {

  if (message.response.status) {
    return message;
  }

  if (message.request.method !== 'DELETE') {
    return message;
  }

  if (message.request.path.indexOf('.') === 0) {
    message.response.status = 403;
    return message;
  }

  const requestPath = path.resolve(env.root + message.request.path);

  if (!fs.existsSync(requestPath)) {
    message.response.status = 404;
    return message;
  }

  const requestPathStat = fs.statSync(requestPath);

  if (requestPathStat.isFile()) {
    // ... 200 overwrite
    fs.unlinkSync(requestPath);
    message.response.status = 200;
    return message;
  }

  message.response.status = 403;
  return message;
}
