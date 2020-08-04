const http = require('http');
const path = require('path');
const fileSystem = require('fs');

http.createServer((req, response) => {
  let filePath = path.join(__dirname, 'index.html');

  if (req.url === '/') filePath = path.join(__dirname, 'index.html');
  if (req.url === '/fingerprint.js') filePath = path.join(__dirname, '/fingerprint.js');

  const readStream = fileSystem.createReadStream(filePath);
  // We replaced all the event handlers with a simple call to readStream.pipe()
  readStream.pipe(response);
}).listen(8080);
