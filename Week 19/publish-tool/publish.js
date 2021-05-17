const http = require('http')
const fs = require('fs')
const archiver = require('archiver')

const UploadFolder = './workspace/.upload/'
const UploadFileName = 'publish.zip'
const UploadFile = UploadFolder + UploadFileName
const PublicFolder = './publish'


if (!fs.existsSync(UploadFolder)) {
  fs.mkdirSync(UploadFolder)
}

const archive = archiver('zip', {
  zlib: {
    level: 9
  }
})

function upload() {
  return new Promise((resolve, reject) => {
    archive.directory(PublicFolder, false)
    archive.finalize()
    archive.pipe(fs.createWriteStream(UploadFile))
    archive.on('finish', () => {
      resolve()
    })
    archive.on('error', (err) => {
      reject(err)
    })
  }).then(() => {
    return new Promise((resolve, reject) => {
      fs.stat(UploadFile, (err, stat) => {
        if (err) {
          return reject(err)
        }
        resolve(stat)
      })
    })
  }).then((stat) => {
    console.log('sta', stat)
    return new Promise((resolve, reject) => {
      const request = http.request({
        hostname: '127.0.0.1',
        port: 3003,
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          // 'Content-Length': stat.size
        }
      }, response => {
        console.log('response.statusCode', response.statusCode)
        if (response.statusCode == 200) {
          resolve(response)
        } else {
          reject(response)
        }
      })
      const file = fs.createReadStream(UploadFile)
      file.pipe(request)
      file.on('end', () => {
        console.log('read finished')
        request.end()
      })
    })
  }, err => {
    console.error('error upload:', err)
  }).then(res => {
    console.log('upload success')
  }).catch(err => {
    // console.log('error', err)
  })
}

upload()



