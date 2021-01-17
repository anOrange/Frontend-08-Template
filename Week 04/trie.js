
const EmptySymbol = Symbol('$')
const ParentSymbol = Symbol('parent')
const CharSymbol = Symbol('character')

class Trie {

  constructor() {
    this.table = Object.create(null)
  }

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
    if (!(EmptySymbol in node)) {
      node[EmptySymbol] = 0
    }
    node[EmptySymbol]++
  }

  most() {
    let max = 0
    let maxNode = null
    const vistit = (node) => {
      if (node[EmptySymbol] && node[EmptySymbol] > max) {
        max = node[EmptySymbol];
        maxNode = node
      }
      for (let p in node) {
        vistit(node[p])
      }
    }
    vistit(this.table)
    let maxWord = []
    let node = maxNode
    while(node && node[ParentSymbol]) {
      maxWord.push(node[CharSymbol])
      node = node[ParentSymbol]
    }
    console.log('max', max, maxWord.reverse().join(''))
    return {
      maxLen: max,
      maxWord: maxWord.reverse().join('')
    }
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

trie.most()

