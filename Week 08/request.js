const net = require('net');

exports.Request = class Request {
  constructor(options) {
    this.method = options.method || 'GET'
    this.host = options.host
    this.port = options.port || 80
    this.path = options.path || '/'
    this.headers = options.headers || {}
    this.body = options.body || {}
    if (!this.headers['Content-type']) {
      this.headers['Content-type'] = 'application/x-www-form-urlencoded'
    }
    if (this.headers['Content-type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    } else if (this.headers['Content-type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
    }

    this.bodyLength = this.bodyText.length
    this.headers['Content-Length'] = this.bodyLength
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      // ...
      const parser = new ResponseParser()
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          console.log(this.toString())
          connection.write(this.toString())
        })
      }
      connection.on('data', data => {
        console.log(data.toString())
        parser.receive(data.toString())
        if (parser.isFinished) {
          resolve(parser.response)
          connection.end()
        }
      })
      connection.on('error', err => {
        reject(err)
        connection.end()
      })
    })
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r\n${
      Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`)
      .join('\r\n')
    }\r\n\r\n${this.bodyText}`
  }
}

class ResponseParser {
  constructor() {

  }

  receive(str) {
    for (let c of str) {
      this.receiveChar(c)
    }
  }

  receiveChar(char) {

  }
}
