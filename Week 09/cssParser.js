
const css = require('css')

let rules = []
function addCSSRules(cssText) {
  var ast = css.parse(cssText)
  console.log(JSON.stringify(ast, null, '     '))
  rules.push(...ast.stylesheet.rules)
}

function computeCSS(element) {
  console.log(rules)
  console.log('compute CSS for element', element)
}


module.exports.addCSSRules = addCSSRules;
module.exports.computeCSS = computeCSS;
module.exports.cssRules = rules;
