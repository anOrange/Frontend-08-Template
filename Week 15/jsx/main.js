/*
for (let i of [1, 2, 4]) {
  console.log(i)
}

var a = <div>aaa<span>bbb</span></div>
*/


import { createElement } from './framework.ts'
import { gestureEnable } from './gesture.ts'
import Carousel from './carousel.tsx'


let aa = new Carousel()
aa.mountTo(document.body)
const aaa = <div>
  <span>asdf</span>
  <span>2222</span>
</div>
aaa.mountTo(document.body)



gestureEnable(document.body)
