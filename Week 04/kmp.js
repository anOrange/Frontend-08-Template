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
    if (pattern[j] != source[i]) {
      while (true) {
        j = nexts[j - 1]
        if (j > 0) {
          if (pattern[j] == source[i]) {
            break
          } else {
            // 没匹配上，继续往下匹配
          }
        } else {
          j = 0
          break;
        }
      }
    } else {
      // 模式串增加一位
      j++
    }

    // 判断匹配完成
    if (j === pattern.length - 1) {
      return {
        start: i - j + 1,
        end: i + 1
      };
    }
  }
  return null
}

function getNexts(pattern) {
  let nexts = new Array(pattern.length).fill(0)
  let j = 0; // 模式串匹配的下标
  let i = 1;
  while (i < pattern.length) {
    if (pattern[i] == pattern[j]) {
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

let pattern = 'afafieflaf'
pattern = 'aabaaac'
let nexts = getNexts(pattern)
console.log(nexts)

let source = 'cadfaabaaacwwwef'

let result = kmp(source, pattern)
console.log(result)
if (result) {
  console.log(source.slice(result.start, result.end + 1))
}