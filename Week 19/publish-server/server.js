/*
 * @Description: 
 * @Author: zhuo.pan
 * @Date: 2021-05-18 00:36:59
 * @LastEditTime: 2021-05-18 03:50:38
 * @LastEditors: zhuo.pan
 */
const http = require('http')
const fs = require('fs')
const unzipper = require('unzipper')
const querystring = require('querystring')
const https = require('https')

const PublishFolder = '../server/public/'
const UploadPackFolder = './workspace/.upload/'

/**
 * 权限白名单
 */
const whileList = ['anOrange', 'TurnerXi', 'anOrange7']

if (fs.existsSync('./config.js')) {
  var config = require('./config.js')
} else {
  console.error('请拷贝模板 config.js.tpl 到 config.js')
  process.exit(1)
}

if (!fs.existsSync(UploadPackFolder)) {
  fs.mkdirSync(UploadPackFolder)
}

http.createServer(function(request, response) {
  // console.log(request.headers)
  if (request.url.match(/^\/auth\?/)) {
    return auth(request, response)
  }
  if (request.url.match(/^\/publish\?/)) {
    return publish(request, response)
  }
  response.writeHead(404)
  response.end('404 not found')
  
}).listen(3003)


/**
 * 授权路由
 */
function auth(req, res) {
  let query = querystring.parse(req.url.match(/^\/auth\?([\s\S]+)$/)[1])
  console.log('query', query)
  getToken(query.code, info => {
    console.log('info', info)
    res.write(`<a href="http://localhost:8083/publish?token=${info.access_token}">publish(token: ${info.access_token})</a>`)
    res.end()
  })
}

/**
 * 获取用户token
 */
function getToken(code, callback) {
  let request = https.request({
    // hostname: 'github.com',
    // path: `/login/oauth/access_token?code=${code}&client_id=${config.git.clientId}&client_secret=${config.git.clientSecret}`,
    hostname: 'gitee.com',
    path: `/oauth/token?grant_type=authorization_code&code=${code}&client_id=${config.gitee.clientId}&client_secret=${config.gitee.clientSecret}&&redirect_uri=https%3A%2F%2Fgeek.skyvoid.com%2Fpublish%2Fauth`,
    prot: 443,
    method: 'POST',
  }, function(response) {
    let body = ''
    response.on('data', chunk => {
      body += chunk.toString()
    }) 
    response.on('end', chunk => {
      console.log('getToken', body)
      typeof callback === 'function' && callback(JSON.parse(body))
    }) 
  })
  request.end()
}

/**
 * 获取用户信息
 */
function getUserInfo(token, callback) {
  let request = https.request({
    // hostname: 'api.github.com',
    // path: `/user`,
    hostname: 'gitee.com',
    path: `/api/v5/user?access_token=${token}`,
    prot: 443,
    method: 'GET',
    headers: {
      Authorization: `token ${token}`,
      'User-Agent': config.git.appName
    }
  }, function(response) {
    let body = ''
    response.on('data', chunk => {
      body += chunk.toString()
    }) 
    response.on('end', chunk => {
      typeof callback === 'function' && callback(JSON.parse(body))
    }) 
  })
  request.end()
}

/**
 * 发布路由
 */
function publish(request, response) {
  const uploadName = `upload_${Date.now()}_${(Math.random() * 1000) >> 0}.zip`
  const UploadPackFile = UploadPackFolder + uploadName

  return new Promise((resolve, reject) => {
    // 获取用户信息
    console.log(request.url)
    let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);
    getUserInfo(query.token, (info) => {
      resolve(info)
    })
  }).then(info => {
    // 用户身份校验
    console.log(info)
    if (whileList.findIndex(acc => acc === info.login) > -1) {
      return true
    } else {
      return false
    }
  }).then(authSuccess => {
    console.log('authSuccess', authSuccess)
    if (!authSuccess) {
      response.writeHead(403)
      response.end()
      return
    }
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
  }).catch(error => {
    response.writeHead(500)
    response.end()
    console.log('error', error)
  })
}