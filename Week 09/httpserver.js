
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
        <title>寻路是是是find route</title>
        <style type="text/css">
          #map {
            width: 700px;
            height: 700px;
            display: flex;
            flex-wrap: wrap;
          }
          div div.block {
            top: 10px;
            width: 16px;
          }
          .block {
            width: 5px;
            height: 5px;
            background: #CCC;
            border: 1px seashell solid;
          }
        </style>
      </head>
      <body>
        <div id="map">
          <div class="block"></div>
          <div class="block"></div>
          <div class="block"></div>
        </div>
        <button onclick="onSaveBtnClick()">save</button>
        <button onclick="onClearClick()">clear</button>
      </body>
    </html>
    `)
  });
}).listen('8080')
console.log('listen port 8080')
