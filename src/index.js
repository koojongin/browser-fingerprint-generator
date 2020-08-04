const http = require('http');
const path = require('path');
const fileSystem = require('fs');

http.createServer((req, response) => {
  try {
    let filePath = path.join(__dirname, 'index.html');
    const staticPaths = ['/','/index.html','/fingerprint-generator.js','/favicon.ico'];
    if(staticPaths.indexOf(req.url) !== -1 ){
      filePath = path.join(__dirname, req.url);
      const readStream = fileSystem.createReadStream(filePath);
      readStream.pipe(response);
    } else{
      response.send('gg');
    }
  }
  catch(e){
    console.log(e);
  }
}).listen(8080);
