import { createElement } from './framework/framework.ts'
import Carousel from './component/carousel.tsx'



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