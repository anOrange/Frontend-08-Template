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
      const parser = new ResponseParser()
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          // console.log(this.toString())
          connection.write(this.toString())
        })
      }
      connection.on('data', data => {
        // console.log(data.toString())
        parser.receive(data.toString())
        // console.log('isFinished', parser.isFinished)
        if (parser.isFinished) {
          // console.log('response', parser.response)
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

const ResParserStates = responseParserStates()
class ResponseParser {
  constructor() {
    this.currentState = ResParserStates.waitSatusLine
    this.headers = {}
    this.statusLine = ''
    this._curHeaderName = ''
    this._curHeaderValue = ''
    this.bodyParser = null
  }

  receive(str) {
    for (let c of str) {
      this.receiveChar(c)
    }
  }

  receiveChar(char) {
    let ret = this.currentState(char, this)
    this.currentState = ret.nextState
    if (this.currentState === ResParserStates.errorState) {
      console.error('response parser error', ret.errorMsg)
    }
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }
}

function responseParserStates() {
  function waitSatusLine(char, config) {
    if (char === '\r') {
      return {
        nextState: waitSatusLineEnd,
        config
      }
    }
    config.statusLine += char
    return {
      nextState: waitSatusLine,
      config: config
    }
  }

  function waitSatusLineEnd(char, config) {
    if (char === '\n') {
      return {
        nextState: waitHeaderName,
        config: config
      }
    } else {
      return errorState(char, config)
    }
  }

  function waitHeaderName(char, config) {
    if (char === ':') {
      return {
        nextState: waitHeaderBlank,
        config
      }
    } else if (char === '\r') {
      if (config.headers['Transfer-Encoding'] === 'chunked') {
        config.bodyParser = new TrunkedBodyParser()
      }
      return {
        nextState: waitHeaderBlockEnd,
        config
      }
    } else {
      config._curHeaderName += char
      return {
        nextState: waitHeaderName,
        config: config
      }
    }
  }

  function waitHeaderBlank(char, config) {
    if (char === ' ') {
      return {
        nextState: waitHeaderValue,
        config
      }
    } else {
      return ResParserStates.errorState(char, config)
    }
  }

  function waitHeaderValue(char, config) {
    if (char === '\r') {
      config.headers[config._curHeaderName] = config._curHeaderValue
      return {
        nextState: waitHeaderLineEnd,
        config
      }
    } else {
      config._curHeaderValue += char
      return {
        nextState: waitHeaderValue,
        config
      }
    }
  }

  function waitHeaderLineEnd(char, config) {
    config._curHeaderValue = ''
    config._curHeaderName = ''
    if (char === '\n') {
      return {
        nextState: waitHeaderName,
        config
      }
    } else {
      return ResParserStates.errorState(char, config)
    }
  }

  function waitHeaderBlockEnd(char, config) {
    if (char === '\n') {
      return {
        nextState: waitBody,
        config
      }
    } else {
      return ResParserStates.errorState(char, config)
    }
  }

  function waitBody(char, config) {
    config.bodyParser.receiveChar(char)
    return {
      nextState: waitBody,
      config
    }
  }

  function errorState(char, config) {
    return {
      nextState: errorState,
      errorMsg: `parser char: ${char} error, while ${config.currentState.name}`,
      config
    }
  }

  return {
    waitSatusLine,
    errorState
  }
}

const TrunkedStates = trunkedBodyParserStates()
class TrunkedBodyParser {
  constructor () {
    this.length = 0
    this.content = []
    this.isFinished = false
    this.currentState = TrunkedStates.waitLength
  }

  receiveChar(char) {
    let ret = this.currentState(char, this)
    this.currentState = ret.nextState
    if (this.currentState == TrunkedStates.errorState) {
      console.error('parser body Error', ret.errorMsg)
    }
    this.isFinished = ret.config.isFinished
    this.content = ret.config.content
    this.length = ret.config.length
  }
}

function trunkedBodyParserStates() {
  function waitLength(char, config) {
    if (char === '\n') {
      if (config.length === 0){
        config.isFinished = true
      }
      return {
        nextState: readingTrunked,
        config
      }
    } else if (char === '\r') {
    } else if (/[0-9a-fA-F]/.test(char)) {
      config.length *= 16
      config.length += parseInt(char, 16)
    } else {
      return errorState(char, config)
    }
    return {
      nextState: waitLength,
      config
    }
  }

  function readingTrunked(char, config) {
    config.content.push(char)
    config.length--
    // console.log(char, config.length)
    if (config.length === 0) {
      return {
        nextState: readNewLine,
        config
      }
    }
    return {
      nextState: readingTrunked,
      config
    }
  }

  function readNewLine(char, config) {
    if (char === '\n') {
      return {
        nextState: waitLength,
        config
      }
    }
    return {
      nextState: readNewLine,
      config
    }
  }

  function errorState(char, config) {
    console.error('errorState', char, config)
    return {
      nextState: errorState,
      errorMsg: `parser char: ${char} error`,
      config
    }
  }

  return {
    waitLength,
    errorState
  }
}
