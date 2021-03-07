
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
    res.end(`
    <html>
      <head>
        <title>flex</title>
        <style type="text/css">
          .main {
            display: flex;
            width: 200px;
            flex-wrap: wrap;
          }
          .block1 {
            width: 100px;
            height: 50px;
            background-color: rgb(0, 100, 50);
          }
          .block2 {
            width: 80px;
            height: 80px;
            background-color: rgb(100, 50, 150);
          }
          .block3 {
            width: 150px;
            height: 60px;
            background-color: rgb(200, 150, 50);
          }
        </style>
      </head>
      <body>
        <div class="main">
          <div class="block1"></div>
          <div class="block2"></div>
          <div class="block3"></div>
        </div>
      </body>
    </html>
    `)
  });
}).listen('8080')
console.log('listen port 8080')
