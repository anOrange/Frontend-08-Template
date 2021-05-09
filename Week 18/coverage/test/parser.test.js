import assert from 'assert'
import { parseHtml } from '../src/parser'

describe('parse html:', function () {
  it('<a></a>', function () {
    const tree = parseHtml('<a></a>')
    assert.strictEqual(tree.children[0].tagName, 'a')
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a href="//skyvoid.com"></a>', function () {
    const tree = parseHtml('<a href="//skyvoid.com"></a>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<a href id></a>', function () {
    const tree = parseHtml('<a href id></a>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<div class="ddd" ></div>', function () {
    const tree = parseHtml('<div class="ddd" ></div>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 0)
  })
  it('<div class="ddd"', function () {
    assert.throws(() => {
      parseHtml('<div class="ddd"')
    }, new Error('eof-in-tag parse error'))
  })
  it('<img /', function () {
    assert.throws(() => {
      parseHtml('<img /')
    }, new Error('eof-in-tag parse error'))
  })
  it('<img src="adff" />', function () {
    const tree = parseHtml('<img src="adff" />')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].tagName, 'img')
    assert.strictEqual(tree.children[0].attributes.length, 1)
    assert.strictEqual(tree.children[0].attributes[0].name, 'src')
    assert.strictEqual(tree.children[0].attributes[0].value, 'adff')
  })
  it('<div style="display:flex"><div style="width:90px;"></div></div>', function () {
    let tree = parseHtml('<div style="display:flex"><div style="width:90px;"></div></div>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].children.length, 1)
    assert.strictEqual(tree.children[0].children[0].attributes[0].name, 'style')
  })
  it('<img src="adff"class="fff"/>', function () {
    const tree = parseHtml('<img src="adff"class="fff"/>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].tagName, 'img')
    assert.strictEqual(tree.children[0].attributes.length, 2)
    assert.strictEqual(tree.children[0].attributes[1].name, 'class')
    assert.strictEqual(tree.children[0].attributes[1].value, 'fff')
  })
  it('<img src= "adff" />', function () {
    const tree = parseHtml('<img src= "adff" />')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].tagName, 'img')
    assert.strictEqual(tree.children[0].attributes.length, 1)
    assert.strictEqual(tree.children[0].attributes[0].name, 'src')
    assert.strictEqual(tree.children[0].attributes[0].value, 'adff')
  })
  it('<div class', function () {
    assert.throws(() => {
      parseHtml('<div class')
    }, new Error('eof-in-tag parse error'))
  })
  it('<img src ="adff"    />', function () {
    const tree = parseHtml('<img src ="adff"    />')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].tagName, 'img')
    assert.strictEqual(tree.children[0].attributes.length, 1)
    assert.strictEqual(tree.children[0].attributes[0].name, 'src')
    assert.strictEqual(tree.children[0].attributes[0].value, 'adff')
  })
  it('<img src="adff" / >', function () {
    const tree = parseHtml('<img src="adff" / >')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].tagName, 'img')
    assert.strictEqual(tree.children[0].attributes.length, 1)
    assert.strictEqual(tree.children[0].attributes[0].name, 'src')
    assert.strictEqual(tree.children[0].attributes[0].value, 'adff')
  })
  it('<img src =\'adff\'  />', function () {
    const tree = parseHtml('<img src =\'adff\'  />')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].tagName, 'img')
    assert.strictEqual(tree.children[0].attributes.length, 1)
    assert.strictEqual(tree.children[0].attributes[0].name, 'src')
    assert.strictEqual(tree.children[0].attributes[0].value, 'adff')
  })
  it('<img/>', function () {
    const tree = parseHtml('<img/>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].tagName, 'img')
    assert.strictEqual(tree.children[0].attributes.length, 0)
  })
  it('<img =/>', function () {
    const tree = parseHtml('<img =/>')
    assert.strictEqual(tree.children.length, 1)
    assert.strictEqual(tree.children[0].tagName, 'img')
    assert.strictEqual(tree.children[0].attributes.length, 0)
  })
  it('</>', function () {
    const tree = parseHtml('</>')
    assert.strictEqual(tree.children.length, 0)
  })
  it('< div></ div>', function () {
    const tree = parseHtml('< div></ div>')
    assert.strictEqual(tree.children.length, 1)
  })
  it('<di&v></div>', function () {
    const tree = parseHtml('<di&v></div>')
    assert.strictEqual(tree.children.length, 1)
  })
  it('<div></&', function () {
    assert.throws(() => {
      parseHtml('<div></&')
    }, new Error('invalid-first-character-of-tag-name parse error'))
  })
  it('<div></aa>', function () {
    assert.throws(() => {
      parseHtml('<div></aa>')
    }, new Error('tag Start end dosen\'t match'))
  })
  it('<div></', function () {
    assert.throws(() => {
      parseHtml('<div></')
    }, new Error('eof-before-tag-name parse error'))
  })
  it('< div class=></ div>', function () {
    const tree = parseHtml('< div class=></ div>')
    assert.strictEqual(tree.children.length, 1)
  })
  it('<div data=fff></div>', function () {
    const tree = parseHtml('<div data=fff></div>')
    console.log(tree)
    assert.strictEqual(tree.children.length, 1)
  })
  it('<div data=abc ></div>', function () {
    const tree = parseHtml('<div data=abc ></div>')
    console.log(tree)
    assert.strictEqual(tree.children.length, 1)
  })
  it('<div class="dd', function () {
    assert.throws(() => {
      parseHtml('<div class="dd')
    }, new Error('eof-in-tag parse error'))
  })
  it('<div class=\'dd', function () {
    assert.throws(() => {
      parseHtml('<div class=\'dd')
    }, new Error('eof-in-tag parse error'))
  })
  it('<div class=dd', function () {
    assert.throws(() => {
      parseHtml('<div class=dd')
    }, new Error('eof-in-tag parse error'))
  })
})