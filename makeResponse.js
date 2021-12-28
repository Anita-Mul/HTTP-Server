const statusMap = {
  500: 'Internal Server Error',
}

module.exports = (message) => {
  if (!message.response.status) {
    message.response.status = 500;
  }

  const reasonPhrase = statusMap[message.response.status];

  const statusLine = `${message.request.version} ${message.response.status} ${reasonPhrase}\r\n`;

  message.response.headers.push({
    key: 'Content-Length',
    value: message.response.body.length
  });

  let headerlines = message.response.headers.map(
    item => `${item.key}: ${item.value}\r\n`
  ).join('');

  headerlines = headerlines + "\r\n";

  return Buffer.concat([
    Buffer.from(statusLine, 'ascii'),
    Buffer.from(headerlines, 'ascii'),
    message.response.body
  ]);
}