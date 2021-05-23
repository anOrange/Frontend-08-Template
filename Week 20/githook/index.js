

function test() {
  let a = 2
  console.log(a);
  Promise.resolve(async () => {
    cosnope.log(a)
  }).catch(err => {

  })
}

test()

