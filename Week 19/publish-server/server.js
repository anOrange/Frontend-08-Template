const http = require('http')
const fs = require('fs')


http.createServer(function(request, response) {
  console.log(request.headers)

  fs.createWriteStream('../server/publish/index.html')

  request.on('data', chunk => {
    console.log(chunk.toString())
  })

  request.on('end', chunk => {
    response.end('success')
  })
}).listen(3003)