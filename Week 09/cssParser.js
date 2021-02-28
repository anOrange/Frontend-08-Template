
const css = require('css')

let rules = []
function addCSSRules(cssText) {
  var ast = css.parse(cssText)
  // console.log(JSON.stringify(ast, null, '     '))
  rules.push(...ast.stylesheet.rules)
}

function computeCSS(element) {
  // console.log('compute CSS for element', element)
  let elements = [element]
  let parent = element.parent
  while (parent) {
    elements.push(parent)
    parent = parent.parent
  }
  // console.log(elements)

  if (!element.computedStyle) {
    element.computedStyle = {}
  }

  for (let rule of rules) {
    let selectorParts = rule.selectors[0].split(' ').reverse()
    // if (element.class === 'block') {
    //   debugger
    // }
    if (!match(element, selectorParts[0])) {
      continue
    }

    let matched = false

    var j = 1
    for (var i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++
      }
    }
    if (j >= selectorParts.length) {
      matched = true
    }
    if (matched) {
      
      let sp = specificity(rule.selectors[0])
      var computedStyle = element.computedStyle
      for (let descartion of rule.declarations) {
        const property = descartion.property
        if (!computedStyle.hasOwnProperty(property)) {
          computedStyle[property] = {}
        }

        // 比较优先级
        if (!computedStyle[property].specificity) {
          computedStyle[property].value = descartion.value
          computedStyle[property].specificity = sp
        } else if (specificityCompare(computedStyle[property].specificity, sp) < 0) {
          // 新的优先级高于或者等于，则覆盖
          computedStyle[property].value = descartion.value
          computedStyle[property].specificity = sp
        }
        
      }
      console.log(element.computedStyle)
    }

  }
}

/**
 * 选择器匹配,支持复合选择器
 * @param {Element} element 
 * @param {string} selectorStr 
 */
function match(element, selectorStr) {
  if (!selectorStr || !element.attributes) {
    return false
  }

  let selectorSplit = selectorStr.match(/([\.#]?[a-zA-Z\-]+)/g)
  for (let selector of selectorSplit) {
    if (selector.charAt(0) == '#') {
      let attr = element.attributes.filter(attr => attr.name === 'id')[0]
      if (attr && attr.value === selector.replace('#', '')) {
        // return true
      } else {
        return false
      }
    } else if (selector.charAt(0) == '.') {
      let attr = element.attributes.filter(attr => attr.name === 'class')[0]
      if (attr && attr.value === selector.replace('.', '')) {
        // return true
      } else {
        return false
      }
    } else if (element.tagName === selector) {
      // return true
    } else {
      return false
    }
  }
  return true
}

const ADD_INDEX_MAP = {
  '#': 1,
  '.': 2
}

// 优先级计算
function specificity(selector) {
  let p = [0, 0, 0, 0]
  // let selectorParts = selector.split(' ');
  // 添加复合选择器比较
  let selectorParts = selector.match(/([.#]?[a-zA-Z\-]+)/g)
  for (let part of selectorParts) {
    let i = ADD_INDEX_MAP[part[0]] 
    if (!i) {
      i = 3
    }
    p[i] += 1
  }
  return p
}

function specificityCompare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  } else if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  } else if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }
  return sp1[3] - sp2[3]
}

module.exports.addCSSRules = addCSSRules;
module.exports.computeCSS = computeCSS;
module.exports.cssRules = rules;
