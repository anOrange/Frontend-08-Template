
const CountSymbol = Symbol('$')
const ParentSymbol = Symbol('parent')
const CharSymbol = Symbol('character')

class Trie {

  constructor() {
    this.table = Object.create(null)
  }

  // 插入
  insert(word) {
    let node = this.table
    for (let c of word) {
      if (!node[c]) {
        node[c] = Object.create(null)
        node[c][ParentSymbol] = node
        node[c][CharSymbol] = c
      }
      node = node[c]
    }
    if (!(CountSymbol in node)) {
      node[CountSymbol] = 0
    }
    node[CountSymbol]++
  }

  most() {
    let max = 0
    let maxNode = null
    const vistit = (node) => {
      if (node[CountSymbol] && node[CountSymbol] > max) {
        max = node[CountSymbol];
        maxNode = node
      }
      for (let p in node) {
        vistit(node[p])
      }
    }
    vistit(this.table)
    let maxWordArr = []
    let node = maxNode
    while(node && node[ParentSymbol]) {
      maxWordArr.push(node[CharSymbol])
      node = node[ParentSymbol]
    }
    
    let maxWord = maxWordArr.reverse().join('')
    console.log('max', max, maxWord)
    return {
      maxLen: max,
      maxWord: maxWord
    }
  }

  search(word) {
    let node = this.table
    for (let c of word) {
      if (!node[c]) {
        return null
      }
      node = node[c]
    }
    return node[CountSymbol] || null
  }
}

let trie = new Trie()

function randomWord(length) {
  var s = []
  for(let i = 0; i < length; i++) {
    s[i] = String.fromCharCode(Math.random() * 26 + 'a'.charCodeAt(0))
  }
  return s.join('')
}


for (let i = 0; i < 100000; i++) {
  trie.insert(randomWord(4))
}

// 最多的
let most = trie.most()
console.log('most', most)
// 查找字符串
let serchResult = trie.search(most.maxWord)
console.log(`查找 ${most.maxWord} 个数: `,serchResult)
serchResult = trie.search('abc')
console.log(`查找 abc 个数: `,serchResult)

