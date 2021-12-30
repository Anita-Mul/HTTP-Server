const fs = require("fs");
const path = require("path");

// http://127.0.0.1/1.txt
module.exports = function (message, env) {

  if (message.response.status) {
    return message;
  }

  if (message.request.method !== 'POST') {
    return message;
  }

  // 如果有相对目录是不合法的
  if (message.request.path.indexOf('.') === 0) {
    message.response.status = 403;
    return message;
  }

  const requestPath = path.resolve( env.root + message.request.path);

  if (fs.existsSync(requestPath)) {
    message.response.status = 403;
    return message;
  }

  fs.mkdirSync(path.dirname(requestPath), { recursive: true });
  fs.writeFileSync(requestPath, message.request.body);

  message.response.status = 201;
  return message;
}
