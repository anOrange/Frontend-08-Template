/**
 * 正则匹配验证, 该算法为从头到尾匹配，相当于正则默认上 ^ 和 $
 * @param {*} source 
 * @param {*} reg 
 */
function match(source, reg) {
  let starCount = 0;
  // 计算正则星星数量
  for(let i = 0; i < reg.length; i++) {
    if (reg[i] === '*') {
      starCount++
    }
  }

  if (starCount === 0) {
    for(let i = 0; i < reg.length; i++) {
      if (reg[i] !== source[i] && reg[i] !== '?') {
        return false
      }
    }
    return true;
  }

  let i = 0
  let lastIndex = 0
  // 匹配星号前的
  for(i = 0; reg[i] !== '*'; i++) {
    if (reg[i] !== source[i] && reg[i] !== '?') {
      return false
    }
  }

  lastIndex = i // 忽略前半段

  // 两个星号夹着的，一个就不用了
  for (let p = 0; p < starCount - 1; p++) {
    i++;
    let subPattern = ''
    // 取两个星号分割的
    while(reg[i] !== '*') {
      subPattern += reg[i]
      i++
    }

    let subReg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g')
    subReg.lastIndex = lastIndex
    if (!subReg.exec(source)) {
      return false
    }
    lastIndex = reg.lastIndex
  }

  for (let j = 0; j <= source.length - lastIndex && reg[reg.length - j] !== '*'; j++) {
    if (reg[reg.length - j] !== source[source.length - j] && reg[reg.length - j] !== '?') {
      return false
    }
  }
  return true
}

let result = match('afwe', 'a??e')
console.log(result)
result = match('afaawe', 'a??*e')
console.log(result)
result = match('afaawe', 'a??e')
console.log(result)

/**
 * 动态规划的方式匹配通配符，这种方式时间复杂度比较高 O(s.length * p.length)
 * @param {*} s 要匹配的字符
 * @param {*} p 模式串
 */
function isMatch(s, p) {
  let table = [] 
  let sLen = s.length;
  let pLen = p.length;
  // 初始化表，table[i][j] 为真时，表示 s[0-i] 与 p[0-i] 能匹配上
  for (let i = 0; i <= sLen; i++) {
    table[i] = []
  }
  table[0][0] = true;
  for (let i = 0; i <= sLen; i++) {
    for (let j = 1; j <= pLen; j++) {
      if (p[j - 1] == '*') {
        // 星号的时候, * 号可以任意匹配
        table[i][j] = table[i][j - 1];
        if (i > 0) {
          table[i][j] = table[i][j] || table[i - 1][j];
        }
      } else {
        // 如果不是星号，s[i] == p[j] 或者 p[j] == '?'
        if (i > 0 && (s[i - 1] == p[j - 1] || p[j - 1] == '?')) {
          table[i][j] = table[i - 1][j - 1]
        }
      }
    }
  }
  return !!table[sLen][pLen]
};
console.log('0--------0')
result = isMatch('afwe', 'a??e')
console.log(result)
result = isMatch('afaawe', 'a??*e')
console.log(result)
result = isMatch('afaawe', 'a??e')
console.log(result)


function kmp (source, pattern) {
  if (source.length < pattern.length) {
    // 边界条件
    return
  }
  // 建立 pattern 移动表
  let nexts = getNexts(pattern)

  // 查找主流程
  let j = 0;
  for (let i = 0; i < source.length; i++) {
    if (pattern[j] !== source[i] && pattern[j] !== '?') {
      while (true) {
        j = nexts[j - 1]
        if (j > 0) {
          if (pattern[j] === source[i] || pattern[j] === '?') {
            break
          } else {
            // 没匹配上，继续往下匹配
          }
        } else {
          j = 0
          break;
        }
      }
    }

    // 判断匹配完成
    if (j === pattern.length - 1) {
      return {
        start: i - j ,
        end: i
      };
    }

    
    if (pattern[j] == source[i] || pattern[j] === '?') {
      // 模式串增加一位
      j++
    }
  }
  return null
}

function getNexts(pattern) {
  let nexts = new Array(pattern.length).fill(0)
  let j = 0; // 模式串匹配的下标
  let i = 1;
  while (i < pattern.length) {
    if (pattern[i] === pattern[j] || pattern[j] === '?') {
      nexts[i] = j + 1
      i++
      j++
    } else {
      j = nexts[j - 1]
      if (!j) {
        j = 0
        i++
      }
      continue
    }
  }
  return nexts
}

/**
 * 正则匹配验证, 该算法为从头到尾匹配，相当于正则默认上 ^ 和 $
 * @param {*} source 
 * @param {*} reg 
 */
function kmpMatch(source, reg) {
  let starCount = 0;
  // 计算正则星星数量
  for(let i = 0; i < reg.length; i++) {
    if (reg[i] === '*') {
      starCount++
    }
  }

  if (starCount === 0) {
    for(let i = 0; i < reg.length; i++) {
      if (reg[i] !== source[i] && reg[i] !== '?') {
        return false
      }
    }
    return true;
  }

  let i = 0
  let lastIndex = 0
  // 匹配星号前的
  for(i = 0; reg[i] !== '*'; i++) {
    if (reg[i] !== source[i] && reg[i] !== '?') {
      return false
    }
  }

  lastIndex = i // 忽略前半段

  // 两个星号夹着的，一个就不用了
  for (let p = 0; p < starCount - 1; p++) {
    i++;
    let subPattern = ''
    // 取两个星号分割的
    while(reg[i] !== '*') {
      subPattern += reg[i]
      i++
    }

    // let subReg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g')
    // subReg.lastIndex = lastIndex
    // if (!subReg.exec(source)) {
    //   return false
    // }
    // lastIndex = reg.lastIndex
    let subResult = kmp(source.slice(lastIndex), subPattern)
    if (!subResult) {
      return false
    }
    lastIndex = subResult.end
  }

  for (let j = 0; j <= source.length - lastIndex && reg[reg.length - j] !== '*'; j++) {
    if (reg[reg.length - j] !== source[source.length - j] && reg[reg.length - j] !== '?') {
      return false
    }
  }
  return true
}

console.log('0--------0')
result = kmpMatch('afwe', 'a??e')
console.log(result)
result = kmpMatch('afaawe', 'a??*e')
console.log(result)
result = kmpMatch('afaawe', 'a??e')
console.log(result)
