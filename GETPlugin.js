const fs = require('fs');
const path = require('path');

const helper = require('./helper');

module.exports = function (message, env) {

  if (message.response.status) {
    return message;
  }

  if (message.request.method !== 'GET') {
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

  // 如果是目录，列出目录中的所有内容
  if (requestPathStat.isDirectory()) {
    // 200, directory content
    const directoryContent = fs.readdirSync(requestPath);
    let contentHTML = `<html><head><title>Index Of ${message.request.path}</title></head><body><h1>Index Of ${message.request.path}</h1><hr/><table>`
    contentHTML += directoryContent.map(item => {
      const itemPath = path.resolve(requestPath, item);
      const itemStat = fs.statSync(itemPath);
      let size = '-';
      if (itemStat.isFile()) {
        size = itemStat.size
      }
      return `<tr><td>${item}</td><td>${itemStat.mtime}</td><td>${size}</td></tr>`
    }).join('');

    contentHTML += '</table><hr/></body></html>';

    message.response.body = Buffer.from(contentHTML, 'utf-8');
    message.response.status = 200;

  } else if (requestPathStat.isFile()) {       // 如果是文件，返回文件
    // 200, file content
    const rangeHeader = helper.readHeader(message.request.headers, 'Range');
    if (rangeHeader) {
      // Range: bytes=start-end
      const matchedRange = rangeHeader.match(/bytes\s*=\s*(\d+)\s*-\s*(\d+)/i);
      if (matchedRange) {
        const content = Buffer.alloc(matchedRange[2] - matchedRange[1] + 1);

        const fd = fs.openSync(requestPath);
        fs.readSync(fd, content, 0, content.length, parseInt(matchedRange[1]));
        fs.closeSync(fd);
        message.response.status = 206;
        message.response.body = content;
        helper.setHeader(
          message.response.headers,
          'Content-Range',
          `bytes ${matchedRange[1]}-${matchedRange[2]}/${requestPathStat.size}`
        );
        return message;
      }
    }

    message.response.status = 200;
    message.response.body = fs.readFileSync(requestPath);
    return message;
  }

  message.response.status = 404;
  return message;
}
