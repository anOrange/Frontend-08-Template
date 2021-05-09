/**
 * html parser
 */

const addCSSRules = require('./cssParser').addCSSRules;
const computeCSS = require('./cssParser').computeCSS;
const layout = require('./layout').layout;

const EOF = Symbol('EOF');

// 当前处理的token，用于保存处理状态
var currentToken = null
var currentAttribute = null
var currentTextNode = null

let stack


function emit(token) {
  // console.log(token)
  let top = stack[stack.length - 1]

  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    }

    element.tagName = token.tagName

    if (token.attrs) {
      for (let p in token.attrs) {
        element.attributes.push({
          name: p,
          value: token.attrs[p]
        })
        if (p === 'class' || p === 'id') {
          element[p] = token.attrs[p]
        }
      }
    }
    computeCSS(element)
    top.children.push(element)
    element.parent = top

    if (!top.isSelfClosing) {
      stack.push(element)
    }

    currentTextNode = null
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error('tag Start end dosen\'t match')
    } else {
      if (top.tagName === 'style') {
        addCSSRules(top.children[0].content)
      }
      layout(top)
      stack.pop()
    }
    currentTextNode = null
  } else if (token.type === 'text') {
    if (currentTextNode == null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
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
  if (c === EOF) {
    throw new Error('eof-before-tag-name parse error')
  } else if (c.match(/^[\t\n\f ]$/)) {
    return endTagOpen
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  } else if (c === '>') {
    // This is a missing-end-tag-name parse error. Switch to the data state.
    return data
  } else {
    // This is an invalid-first-character-of-tag-name parse error. Create a comment token whose data is the empty string. Reconsume in the bogus comment state.
    throw new Error('invalid-first-character-of-tag-name parse error')
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


// 自封闭标签
function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if (c === EOF) {
    throw new Error('eof-in-tag parse error')
  } else {
    return beforeAttributeName(c)
  }
}

// 等待接受标签内属性
function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '>' || c === '/' || c === EOF) {
    return afterAttributeName(c)
  } else if ( c === '=') {
    // 错误 <html =
    // throw new Error('unexpected-equals-sign-before-attribute-name parse error.')
    return attributeName
  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function attributeName(c) {
  if (c === EOF || c.match(/^[\t\n\f />]$/)) {
    return afterAttributeName(c)
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '\u0000') {
    // throw new Error('unexpected-null-character parse error')
  } else if (c === '\"' || c === '\'') {
    // throw new Error('unexpected-character-in-attribute-name parse error')
  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function afterAttributeName(c) {
  if (c === EOF) {
    throw new Error('eof-in-tag parse error')
  } else if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else {
    return attributeName(c)
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === EOF) {
    return beforeAttributeValue
  } else if (c === '\"') {
    return doubleQuotedAttributeValue
  } else if (c === '\'') {
    return singleQuotedAttributeValue
  } else if (c === '>') {
    // <div class=></div>
    emit(currentToken)
    return data
  } else {
    // 没有括号的属性
    return UnquotedAttributeValue(c)
  }
}

function UnquotedAttributeValue(c) {
  if (c === EOF) {
    throw new Error('eof-in-tag parse error')
  } else if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else {
    currentAttribute.value += c
    return UnquotedAttributeValue
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '\"') {
    if (!currentToken.attrs) {
      currentToken.attrs = {}
    }
    currentToken.attrs[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF) {
    throw new Error('eof-in-tag parse error')
  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(c) {
  if (c === '\'') {
    if (!currentToken.attrs) {
      currentToken.attrs = {}
    }
    currentToken.attrs[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF) {
    throw new Error('eof-in-tag parse error')
  } else {
    currentAttribute.value += c
    return singleQuotedAttributeValue
  }
}

function afterQuotedAttributeValue(c) {
  if (c === EOF) {
    throw new Error('eof-in-tag parse error')
  } else if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  // } else if (c.match(/^[a-zA-Z]$/)) {
  //   currentToken.tagName += c
  //   return tagName
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else {
    return beforeAttributeName(c)
  }
}

module.exports.parseHtml = function parseHtml(htmlText) {
// export function parseHtml(htmlText) {
  currentToken = null
  currentAttribute = null
  currentTextNode = null
  stack = [{
    type: 'document',
    children: []
  }]
  let state = data;
  for (let c of htmlText) {
    state = state(c);
  }
  state = state(EOF)
  // try {
  //   for (let c of htmlText) {
  //     let preState = state
  //     try {
  //       state = state(c);
  //     } catch (err) {
  //       // console.error(err)
  //       debugger
  //       return err
  //     }
  //   }
  //   state = state(EOF)
  // } catch (err) {
  //   // console.error(err)
  //   debugger
  //   return err
  // }
  // console.log(stack)
  return stack[0]
}

// try {
//   const html1 = `
//   <html>
//     <head>
//       <title>flex</title>
//       <style type="text/css">
//         .main {
//           display: flex;
//           width: 200px;
//           height: 400px;
//           flex-wrap: wrap;
//         }
//         .block1 {
//           width: 100px;
//           height: 50px;
//           background-color: rgb(0, 100, 50);
//         }
//         .block2 {
//           width: 80px;
//           height: 80px;
//           background-color: rgb(100, 50, 150);
//         }
//         .block3 {
//           width: 150px;
//           height: 60px;
//           background-color: rgb(200, 150, 50);
//         }
//       </style>
//     </head>
//     <body>
//       <div class="main">
//         <div class="block1"></div>
//         <div class="block2"></div>
//         <div class="block3"></div>
//       </div>
//     </body>
//   </html>
//   `
//   let tree = module.exports.parseHtml(html1)
//   // console.log(tree)
//   debugger
// } catch (err) {
//   console.error(err)
//   debugger
// }
// try {
//   let tree = module.exports.parseHtml('<div data=fff></div>')
//   console.log(tree)
//   debugger
// } catch (err) {
//   console.error(err)
//   debugger
// }


