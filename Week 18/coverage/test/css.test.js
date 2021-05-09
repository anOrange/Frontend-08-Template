import assert from 'assert'
import { parseHtml } from '../src/parser'

const html1 = `
  <html>
    <head>
      <title>flex</title>
      <style type="text/css">
        .main {
          display: flex;
          width: 200px;
          height: 400px;
          flex-wrap: wrap;
        }
        .block1 {
          width: 100px;
          height: 50px;
          background-color: rgb(0, 100, 50);
        }
        .block2 {
          width: 80px;
          height: 80px;
          background-color: rgb(100, 50, 150);
        }
        .block3 {
          width: 150px;
          height: 60px;
          background-color: rgb(200, 150, 50);
        }
      </style>
    </head>
    <body>
      <div class="main">
        <div class="block1"></div>
        <div class="block2"></div>
        <div class="block3"></div>
      </div>
    </body>
  </html>
  `

  
  
describe('cssParser:', function () {
  it('css flex', function () {
    const tree = parseHtml(html1)
    // console.log(tree.children[0])
    // assert.strictEqual(tree.children[0].tagName, 'a')
    // assert.strictEqual(tree.children[0].children.length, 0)
  })
});