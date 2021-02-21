
const http = require("http")

http.createServer((req, res) => {
  let body = [];
  req.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    console.log('on data', chunk);
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log('onend', body);
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end('Hello world\n')
  });
}).listen('8080')
console.log('listen port 8080')
