/*
for (let i of [1, 2, 4]) {
  console.log(i)
}

var a = <div>aaa<span>bbb</span></div>
*/


import { createElement } from './framework.ts'
import { gestureEnable } from './gesture.ts'
import Carousel from './carousel.tsx'
import {
  Timeline, 
  Animation,
  createAnimationOptions
} from "./animation.ts"
import { ease } from "./timingFunctions.ts"

console.log('test 001')

{


  let tl = new Timeline();

  tl.start();

  // tl.add(new Animation(
  //   createAnimationOptions(document.querySelector("#el").style, "transform", 0, 500, 6000, 0, 2,ease, v => `translateX(${v}px)`))
  //   )

  tl.add(new Animation({
    object: document.querySelector("#el").style,
    property: "transform",
    repeat: 2,
    startValue: 0, 
    endValue: 500, 
    duration: 2000, 
    delay: 0, 
    timingFunction: ease,
    template: v => `translateX(${v}px)`
  }))
  document.querySelector("#el2").style.transition = 'transform ease 2s'
  document.querySelector("#el2").style.transform = 'translateX(500px)'

  document.querySelector("#pause-btn").addEventListener("click", ()=> tl.pause())
  document.querySelector("#resume-btn").addEventListener("click", ()=> tl.resume())
}


{
  // 轮播图
  let aa = new Carousel()
  aa.mountTo(document.body)
  const aaa = <div>
    <span>asdf</span>
    <span>2222</span>
  </div>
  aaa.mountTo(document.body)
}

{
  // 手势
gestureEnable(document.body)
}