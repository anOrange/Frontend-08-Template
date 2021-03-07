const Request = require('./request').Request
const parser = require('./parser')
const render = require('./render')
const images = require('images')

void async function () {
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8080',
    path: '/',
    headers: {
      'X-Foo2': 'customed'
    },
    body: {
      name: 'anOrange',
    }
  })

  let response = await request.send()

  console.log(response)
  let dom = parser.parseHtml(response.body)
  let viewport = images(800, 600)
  // let img1 = images(100, 60)
  // img1.fill(100, 200, 50, 1)
  viewport.draw(img1, 100, 50)
  render(viewport, dom)

  viewport.save('viewport.png')
}()
