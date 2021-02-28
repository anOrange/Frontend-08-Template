/**
 * html parser
 */

const EOF = Symbol('EOF');

// 当前处理的token，用于保存处理状态
var currentToken = null

function emit(token) {
  console.log(token)
}

// 等待有效字符
function data(c) {
  if (c === '<') {
    return tagOpen
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
    return data
  } else {
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}

// 打开标签
function tagOpen(c) {
  if (c === '/') {
    return endTagOpen
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c)
  } else {
    return tagOpen
  }
}

// 结束标签接收tagName
function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return endTagName(c)
  } else if (c === EOF) {
    return
  } else {
    return endTagOpen
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c
    return tagName
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else {
    return tagName
  }
}

/**
 * 结束标签
 */
function endTagName(c) {
  if (c === '/') {
    return
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c
    return endTagName
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else {
    return endTagName
  }
}

// 自封闭标签
function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true
    return data
  } else if (c === EOF) {

  } else {

  }
}

// 等待接受标签内属性
function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '>' || c === '/' || c === EOF) {
    return afterAttributeName
  } else if ( c === '=') {
    // 错误 <html =
  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f />]$/) || c === EOF) {
    return afterAttributeName
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '\u0000') {

  } else if (c === '\"' || c === '\'') {

  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f />]$/) || c === EOF) {
    return afterAttributeName
  } else if (c === '=') {
    return beforeAttributeValue
  } else {

  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f />]$/) || c === EOF) {
    return beforeAttributeValue
  } else if (c === '\"') {
    return doubleQuotedAttributeValue
  } else if (c === '\'') {
    return singleQuotedAttributeValue
  } else if (c === '>') {
    // <div class=>
  } else {
    // 没有括号的属性
    return UnquotedAttributeValue(c)
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '\"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF) {
  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(c) {
  if (c === '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF) {
  } else {
    currentAttribute.value += c
    return singleQuotedAttributeValue
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c
    return tagName
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else {
  }
}


module.exports.parseHtml = function parseHtml(htmlText) {
  console.log(htmlText);
  let state = data;
  for (let c of htmlText) {
    state = state(c);
  }
  state = state(EOF)
}
