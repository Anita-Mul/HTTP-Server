function readHeader (headers, key) {
    const filterdHeaders = headers.filter(
      item => item.key === key
    );
  
    if (
      filterdHeaders &&
      filterdHeaders[0] &&
      typeof filterdHeaders[0].value === 'string'
    ) {
      return filterdHeaders[0].value.trim();
    }
  
    return null;
  }
  
  function setHeader (headers, key, value) {
    const filterdHeaders = headers.filter(
      item => item.key === key
    );
  
    if (
      filterdHeaders &&
      filterdHeaders[0]
    ) {
      filterdHeaders[0].value = value;
    }
  
    headers.push({key, value});
    return true;
  }
  
  
  module.exports = {
    readHeader,
    setHeader
  }