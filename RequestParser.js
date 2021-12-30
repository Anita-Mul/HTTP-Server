const Events = require('events')

class RequestParser extends Events {
  _state = this._read_request_line;
  _cache = null;

  _message = {
    request: {
      method: '',
      path: '',
      version: '',
      headers: [],
      body: Buffer.from('')
    },
    response: {
      status: 0,
      headers: [],
      body: Buffer.from('')
    }
  };

  append (buffer) {
    // 一个字节一个字节的读取
    for (let offset = 0; offset < buffer.length; offset++) {
      this._state = this._state(buffer[offset]);
    }
  }

  /**
   * 
   * 【method】 SP 【URL】 SP 【version】 CR LF          [request line]
   * 【header field name】:【value】 CR LF               [header lines]
   *  CR LF
   *               Entity Body       
   */
  _read_request_line (char) {
    if (!this._cache) {
      // Method, URI, Version, CR LF
      this._cache = [1, '' ,'' ,'', false];
    }

    if (char === 0x20) { // === SP  空格
      this._cache[0]++;
    } else if (char === 0x0D) { // === CR  回车
      this._cache[4] = true;
    } else if (char === 0x0A && this._cache[4]) { // === LF  换行
      this._message.request.method = this._cache[1];
      this._message.request.path = this._cache[2];
      this._message.request.version = this._cache[3];
      this._cache = null;
      return this._read_header_line;
    } else {
      // 把 ASCII 码转换成字符
      this._cache[this._cache[0]] += String.fromCharCode(char);
    }

    return this._read_request_line;
  }

  // 读取请求头
  _read_header_line (char) {
    if (!this._cache) {
      // Token: content CRLF
      // [pointer, token, content, CRFlage]
      this._cache = [1, '' ,'' ,false];
    }

    if (char === 0x3A) { //   :
      this._cache[0]++;
    } else if (char === 0x0D) { //   CR
      this._cache[3] = true;
    } else if (char === 0x0A && this._cache[3]) { //   LF
      if (this._cache[1]) {
        this._message.request.headers.push({
          key: this._cache[1],
          value: this._cache[2]
        });
        this._cache = null;
        return this._read_header_line;
      } else {
        // 如果是请求头和请求体之间的那个空行，意味着全部的请求头都已经结束
        // 提取出请求头中的 'content-Lenth'
        const contentLengthHeaders = this._message.request.headers.filter(
          item => item.key === 'Content-Length'
        );
          
        // 如果有请求体
        if (
          contentLengthHeaders &&
          contentLengthHeaders[0] &&
          contentLengthHeaders[0].value > 0
        ) {
          this._cache = null;
          return this._read_body;
        }

        // 如果没有请求体
        this._cache = null;
        return this._send_finish_event();
      }
    } else {    // 如果是普通字符
      this._cache[this._cache[0]] += String.fromCharCode(char);
    }

    return this._read_header_line;
  }

  // 读取请求体 
  _read_body (char) {
    // 请求体的长度
    const contentLength = this._message.request.headers.filter(
      item => item.key === 'Content-Length'
    )[0].value;

    if (!this._cache) {
      // [请求体的总长度, 现在读了几个字节的数据, 创建contentLength字节长度的数组]
      this._cache = [
        parseInt(contentLength) ,
        0,
        new Uint8Array(parseInt(contentLength))
      ];
    }

    if (this._cache[1] < this._cache[0]) {
      this._cache[2][this._cache[1]] = char;
      this._cache[1]++;

      // 读取请求体完成
      if (this._cache[1] === this._cache[0]) {
        this._message.request.body = Buffer.from(this._cache[2]);
        return this._send_finish_event();
      }
    }

    return this._read_body;
  }

  // 读取结束
  _send_finish_event (char) {
    this.emit('finish', this._message);
    return this._end(char)
  }

  _end (char) {
    return this._end;
  }
}

module.exports = RequestParser;
