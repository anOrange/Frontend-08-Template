/*
 * @Description: 
 * @Author: zhuo.pan
 * @Date: 2021-05-18 00:36:59
 * @LastEditTime: 2021-05-18 00:37:00
 * @LastEditors: zhuo.pan
 */
const http = require('http')
const fs = require('fs')
const unzipper = require('unzipper')

const PublishFolder = '../server/public/'
const UploadPackFolder = './workspace/.upload/'

if (!fs.existsSync(UploadPackFolder)) {
  fs.mkdirSync(UploadPackFolder)
}

http.createServer(function(request, response) {
  console.log(request.headers)
  const uploadName = `upload_${Date.now()}_${(Math.random() * 1000) >> 0}.zip`
  const UploadPackFile = UploadPackFolder + uploadName
  const writeStream = fs.createWriteStream(UploadPackFile)

  request.pipe(writeStream).on('finish', () => {
    console.log('Upload finish')
    const readStream = fs.createReadStream(UploadPackFile)
    readStream.pipe(unzipper.Extract({
      path: PublishFolder
    }))
    readStream.on('end', () => {
      response.writeHead(200)
      response.end(JSON.stringify({
        file: UploadPackFile,
        status: 'success'
      }))
      console.log('upload success')
      // writeStream.end()
    }).on('error', err => {
      response.writeHead(500)
      response.end(JSON.stringify({
        status: 'error',
        msg: err.message
      }))
      console.log('upload error', err)
      // writeStream.end()
    })
    
  })
}).listen(3003)