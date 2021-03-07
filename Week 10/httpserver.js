
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
          .block {
            width: 5px;
            height: 5px;
            background: #CCC;
            border: 1px seashell solid;
          }
        </style>
      </head>
      <body>
        <div style="main">
          <div class="block"></div>
          <div class="block"></div>
          <div class="block"></div>
        </div>
      </body>
    </html>
    `)
  });
}).listen('8080')
console.log('listen port 8080')
