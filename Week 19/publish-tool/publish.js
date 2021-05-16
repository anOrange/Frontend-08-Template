const http = require('http')
const fs = require('fs')


const request = http.request({
  hostname: '127.0.0.1',
  port: 3003,
  method: 'POST',
  headers: {
    'Content-Type': 'application/octet-stream'
  }
}, response => {
  console.log(response)
})

let file = fs.createReadStream('./package.json')

file.on('data', chunk => {
  // console.log(chunk.toString())
  request.write(chunk)
})

file.on('end', chunk => {
  console.log('read finished')
  request.end(chunk)
})

