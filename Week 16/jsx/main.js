/*
for (let i of [1, 2, 4]) {
  console.log(i)
}

var a = <div>aaa<span>bbb</span></div>
*/


import { createElement } from './framework/framework.ts'
import { gestureEnable } from './framework/gesture.ts'
import Carousel from './component/carousel.tsx'
import {
  Timeline, 
  Animation,
  createAnimationOptions
} from "./animation/animation.ts"
import { ease } from "./animation/timingFunctions.ts"


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
  // document.querySelector("#el2").style.transition = 'transform ease 2s'
  // document.querySelector("#el2").style.transform = 'translateX(500px)'

  // document.querySelector("#pause-btn").addEventListener("click", ()=> tl.pause())
  // document.querySelector("#resume-btn").addEventListener("click", ()=> tl.resume())
}


{
  
  const imgList = [
    {
      src: './img/0.jpg'
    },
    {
      src: './img/1.jpg'
    },
    { 
      src: './img/2.jpg'
    },
    {
      src: './img/3.jpg'
    }
  ]

  const carouselCmp = <Carousel onChange={(event) => {
    console.log('changed', event)
  }} duration={2021} imgList={imgList}></Carousel>
  carouselCmp.mountTo(document.body)
}