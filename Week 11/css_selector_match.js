const EOF = Symbol('EOF')

async function match(selector, element) {

  // step1: 先得到selector的token
  let charlist = selector.split('')
  charlist.push(EOF)
  let state = dataState
  let environment = {
    currentState: state,
    currentToken: '',
    currentSimpleSelector: [],
    simpleSelectorList: [],
  }
  for (let char of charlist) {
    [state] = state(char, environment)
    if (state === unknownState) {
      break 
    }
  }
  if (environment.currentToken)
  if (environment.currentSimpleSelector) {
    environment.simpleSelectorList.push(environment.currentSimpleSelector)
    environment.currentSimpleSelector = []
  }
  console.log(environment.simpleSelectorList)
  let selectorList = [...environment.simpleSelectorList].reverse()

  // 倒着遍历 element
  while (element) {
    element.className = element.className + ' finding'
    await sleep()
    // 对比当前元素
    let classList = element.className.split(' ')
    let simple = [...selectorList[0]].filter(item => {
      if (item.type === 'type') {
        // 标签名比较
        if (element.tagName.toUpperCase() === item.token.toUpperCase()) {
          return false
        }
        return true        
      } else if (item.type === 'id') {
        if (item.token === element.id) {
          return false
        }
        return true
      } else if (item.type === 'class') {
        if (classList.indexOf(item.token) > -1) {
          return false
        }
        return true
      } else if (item.type === 'attr') {
        // 属性匹配, 这里不处理通配符了
        if (item.value === element.getAttribute(item.name)) {
          return false
        }
        return true
      }
      return true
    })
    if (simple.length === 0) { // 该元素都匹配了
      element.className = element.className + ' matching'
      selectorList.shift()      
    }
    element.className = element.className.replace(' finding', '')
    if (selectorList.length === 0) {
      return true
    } else {
      // 往父级查找
      element = element.parentElement
    }
  }
  return false;
}


function dataState(char, environment) {
  if (char === EOF) {
    return [endState]
  } else if (char === ".") {
    return [classTokenState]
  } else if (char === '#'){
    return [idTokenState]
  } else if (char === '*') {
    return [classTokenState]
  } else if (/[a-zA-Z0-9\-\_]/.test(char)) {
    return typeTokenState(char, environment)
  } else if (char === ' ') {
    return [dataState]
  } else if (char === '[') {
    return [attributeTokenState]
  } else {
    return [unknownState]
  }
}

function unknownState() {
  throw new Error("unkonw token")
}

function idTokenState(char, environment) {
  if (char === EOF) {
    let currentSimpleSelector = environment.currentSimpleSelector
    currentSimpleSelector.push({
      type: 'id',
      token: environment.currentToken
    })
    environment.currentToken = ''
    environment.simpleSelectorList.push(currentSimpleSelector)
    environment.currentSimpleSelector = []
    return [endState]
  } else if (char === " ") {
    let currentSimpleSelector = environment.currentSimpleSelector
    currentSimpleSelector.push({
      type: 'id',
      token: environment.currentToken
    })
    environment.currentToken = ''
    environment.simpleSelectorList.push(currentSimpleSelector)
    environment.currentSimpleSelector = []
    return [dataState]
  } else if (char === '.') {
    environment.currentSimpleSelector.push({
      type: 'id',
      token: environment.currentToken
    })
    environment.currentToken = ''
    return [classTokenState]
  } else if (/[a-zA-Z0-9\-\_]/.test(char)) {
    environment.currentToken += char
    return [idTokenState]
  } else {
    return [unknownState]
  }
}

function endState(char, environment) {
  return [unknownState]
}

function typeTokenState(char, environment) {
  if (char === EOF) {
    environment.currentSimpleSelector.push({
      type: 'type',
      token: environment.currentToken
    })
    environment.currentToken = ''
    environment.simpleSelectorList.push(environment.currentSimpleSelector)
    environment.currentSimpleSelector = []
    return [endState]
  } else if (/[a-zA-Z0-9\-\_]/.test(char)) {
    environment.currentToken += char
    return [typeTokenState]
  } else if (char === ' ') {
    environment.currentSimpleSelector.push({
      type: 'type',
      token: environment.currentToken
    })
    environment.currentToken = ''
    environment.simpleSelectorList.push(environment.currentSimpleSelector)
    environment.currentSimpleSelector = []
    return [dataState]
  } else if (char === '.') {
    environment.currentSimpleSelector.push({
      type: 'type',
      token: environment.currentToken
    })
    environment.currentToken = ''
    return [classTokenState]
  } else if (char === '#') {
    environment.currentSimpleSelector.push({
      type: 'type',
      token: environment.currentToken
    })
    environment.currentToken = ''
    return [idTokenState]
  } else {
    return [unknownState]
  }
}

function attributeTokenState(char, environment) {
  if (char === ' ') {
    return [attributeTokenState]
  } else {
    return [attrNameTokenState(char, environment)]
  }
}

function attrNameTokenState(char, environment) {
  if (/[a-zA-Z0-9\-\~\*\_]/.test(char)) {
    environment.currentToken += char
    return [attrNameTokenState]
  } else if (char === ' ') {
    return [attributeTokenState]
  } else if (char === '=') {
    environment.currentSimpleSelector.push({
      type: 'attr',
      name: environment.currentToken
    })
    environment.currentToken = ''
    return [attrValueTokenState]
  } else {
    return [unknownState]
  }
}

function attrValueTokenState(char, environment) {
  if (/[a-zA-Z0-9\-\~\*\_]/.test(char)) {
    environment.currentToken += char
    return [attrValueTokenState]
  } else if (char === ' ') {
    return [attrValueTokenState]
  } else if (char === ']') {
    const curSelector = environment.currentSimpleSelector
    curSelector[curSelector.length - 1].value = environment.currentToken
    environment.currentToken = ''
    return [dataState]
  } else {
    return [unknownState]
  }
}

function classTokenState(char, environment) {
  if (char === EOF) {
    if (!environment.currentToken) {
      return [unknownState]
    }
    environment.currentSimpleSelector.push({
      type: 'class',
      token: environment.currentToken
    })
    environment.currentToken = ''
    environment.simpleSelectorList.push(environment.currentSimpleSelector)
    environment.currentSimpleSelector = []
    return [endState]
  } else if (/[a-zA-Z0-9\-\_]/.test(char)) {
    // 这里允许数字作为 token 开头了
    environment.currentToken += char
    return [classTokenState]
  } else if (char === '.') {
    if (!environment.currentToken) {
      return [unknownState]
    }
    environment.currentSimpleSelector.push({
      type: 'class',
      token: environment.currentToken
    })
    environment.currentToken = ''
    return [classTokenState]
  } else if (char === ' '){
    if (!environment.currentToken) {
      return [unknownState]
    }
    environment.currentSimpleSelector.push({
      type: 'class',
      token: environment.currentToken
    })
    environment.currentToken = ''
    environment.simpleSelectorList.push(environment.currentSimpleSelector)
    environment.currentSimpleSelector = []
    return [dataState]
  } else {
    return [unknownState]
  }
}


function sleep(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
