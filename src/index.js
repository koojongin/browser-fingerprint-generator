const http = require('http');
const path = require('path');
const fileSystem = require('fs');

http.createServer((req, response) => {
  try {
    let filePath = path.join(__dirname, 'index.html');
    if(req.url == '/fingerprint-generator.js') filePath = path.join(__dirname, req.url);

    const readStream = fileSystem.createReadStream(filePath);
    readStream.pipe(response);
  }
  catch(e){
    console.log(e);
  }
}).listen(8080);
