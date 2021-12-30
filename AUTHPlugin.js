const fs = require("fs");
const path = require("path");
const helper = require('./helper');

module.exports = function (message, env) {

  if (message.response.status) {
    return message;
  }

  const authData = helper.readHeader(message.request.headers, 'Authorization');

  // username = admin, password = 123456
  // Basic base64(user:pass)
  if (authData) {
    const parsedAuthData = authData.match(/basic\s*(\w+)/i);
    if (parsedAuthData[1]) {
      const authPair = Buffer.from(parsedAuthData[1], 'base64').toString().split(':');

      if (authPair[0] === 'admin' && authPair[1] === '123456') {
        // make session , set cookie
        const sessionID = 'session_' + new Date().getTime();

        const sessionPath = path.resolve(env.session, sessionID);
        fs.writeFileSync(sessionPath, authPair[0]);

        helper.setHeader(message.response.headers, 'Set-Cookie', 'sessionid=' + sessionID + ';max-age=3600');

        return message;
      } else {
        message.response.status = 401;
        helper.setHeader(message.response.headers, 'WWW-Authenticate', 'Basic realm="login"');
        return message;
      }
    }
  }

  const cookieData = helper.readHeader(message.request.headers, 'Cookie');

  if (cookieData) {
    const parsedCookieData = cookieData.match(/sessionid=(session_\d+)/);
    if (parsedCookieData && parsedCookieData[1]) {
      const sessionPath = path.resolve(env.session, parsedCookieData[1]);

      if (fs.existsSync(sessionPath)) {
        if (fs.readFileSync(sessionPath).toString() === 'admin') {
          return message;
        }
      }
    }
  }

  message.response.status = 401;
  helper.setHeader(message.response.headers, 'WWW-Authenticate', 'Basic realm="login"');
  return message;
}
