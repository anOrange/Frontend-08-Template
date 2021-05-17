const http = require('http')
const https = require('https')
const fs = require('fs')
const archiver = require('archiver')
const child_process = require('child_process')
const querystring = require('querystring')

const UploadFolder = './workspace/.upload/'
const UploadFileName = 'publish.zip'
const UploadFile = UploadFolder + UploadFileName
const PublicFolder = './publish'


if (fs.existsSync('./config.js')) {
  var config = require('./config.js')
} else {
  console.error('请拷贝模板 config.js.tpl 到 config.js')
  process.exit(1)
}


// child_process.exec(`open https://github.com/login/oauth/authorize?client_id=${config.git.clientId}`)
child_process.exec(`open 'https://gitee.com/oauth/authorize?client_id=${config.gitee.clientId}&redirect_uri=https%3A%2F%2Fgeek.skyvoid.com%2Fpublish%2Fauth&response_type=code'`)



if (!fs.existsSync(UploadFolder)) {
  fs.mkdirSync(UploadFolder)
}


const archive = archiver('zip', {
  zlib: {
    level: 9
  }
})

function upload(token) {
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
    console.log('stats', stat)
    return new Promise((resolve, reject) => {
      const request = https.request({
        hostname: config.hostname,
        port: config.port,
        method: 'POST',
        path: '/publish/publish?token=' + token,
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
    console.log('error', err)
  })
}

// upload(token)

http.createServer((request, response) => {
  let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);
  upload(query.token);
}).listen(8083);

