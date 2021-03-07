
const abStr = 'woeifafweflaablafoewfl';

function findAB(str) {
  let count = 0;
  for (const curChar of str) {
    switch (count) {
      case 0: {
        if (curChar == 'a') {
          count ++
        }
        break;
      }
      case 1: {
        if (curChar == 'b') {
          count ++
        } else {
          count = 0
        }
        if (curChar == 'a') {
          count++
        }
        break;
      }
      case 2: {
        return true
      }
    }
  }
  return false
}

let ret = findAB(abStr)
console.log(ret)


const abcdefStr = 'sldfababcdefajowe';
function findAbcdef(str) {
  let count = 0;
  const matchStr = 'abcdef'
  for (const curChar of str) {
    switch (count) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5: {
        if (curChar == matchStr[count]) {
          count ++
        } else {
          count = 0
        }
        if (curChar == matchStr[count]) {
          count ++
        }
        break;
      }
      case 6: {
        return true
      }
    }
  }
  return false
}


ret = findAbcdef(abcdefStr)
console.log('有abcdef', ret)

ret = findAbcdef('oifwenflanfoweifabcdoiwje')
console.log('没有abcdef', ret)

function kmp(str, pattern) {
  
}
