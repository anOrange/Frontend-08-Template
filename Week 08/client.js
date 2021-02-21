const Request = require('./request').Request

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

}()
