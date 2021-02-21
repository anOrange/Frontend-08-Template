
// 使用状态机寻找 abababx 
let findStr = 'alsaabababababxxkdl'
function match(str) {
  let state = start
  for (c of str) {
    state = state(c)
  }
  return state === end
}

let ret = match(findStr)
console.log(ret)

function start(char) {
  if (char === 'a') {
    return findB
  } else {
    return start
  }
}

function findB(char) {
  if (char === 'b') {
    return findA2
  } else {
    return start(char)
  }
}

function findA2(char) {
  if (char === 'a') {
    return findB2
  } else {
    return start(char)
  }
}

function findB2(char) {
  if (char === 'b') {
    return findA3
  } else {
    return start(char)
  }
}

function findA3(char) {
  if (char === 'a') {
    return findB3
  } else {
    return start(char)
  }
}

function findB3(char) {
  if (char === 'b') {
    return findX
  } else {
    return start(char)
  }
}

function findX(char) {
  if (char === 'x') {
    return end
  } else {
    return findA3(char)
  }
}

function end() {
  return end
}
