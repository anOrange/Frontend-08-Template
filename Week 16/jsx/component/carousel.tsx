/// <reference path = "../framework/gesture.ts" />
import { BaseComponent, React, ElementWrapper, ATTRIBUTES, STATES } from '../framework/framework'
import { gestureEnable, GestureEventType } from '../framework/gesture'
import { Timeline, Animation } from '../animation/animation'
import { ease } from '../animation/timingFunctions'


const kDuration = Symbol('duration')
const kOnChanged = Symbol('on-changed')
const kImgList = Symbol('img-list')
const kIntervalHandle = Symbol('interval-handle')

namespace GeekCarousel {
  export type ImgItemType = {
    src: string,
    title?: string
  }
}

export default class Carousel extends BaseComponent {

  // STATES
  // position: number = 0

  // ATTRIBUTES
  ;width = 500
  ;[kDuration] = 2000
  ;[kOnChanged] = (position: number) => {}
  ;[kImgList]: GeekCarousel.ImgItemType[] = []

  constructor() {
    super()
    this[kImgList] = []
    this[STATES].position = 0
  }

  didMounted() {
    
    const eWarp = this.root as ElementWrapper
    const element: HTMLElement = eWarp.root
    gestureEnable(element)

    const children = Array.from(element.children) as Array<HTMLElement>
    const imageCount = children.length
    const width = this[ATTRIBUTES].width || 500
    let animationStartProgress = 0

    const nextImage = () => {
      animationStartProgress = timeline.getProgress()
      let nextIndex = (this[STATES].position + 1) % imageCount
      timeline.add(new Animation({
        object: children[this[STATES].position].style,
        property: "transform",
        startValue: -this[STATES].position * width,
        endValue: -this[STATES].position * width - width,
        duration: 500, 
        timingFunction: ease,
        template: (progress) => `translateX(${progress}px)`
      }))
      timeline.add(new Animation({
        object: children[nextIndex].style,
        property: "transform",
        startValue: -nextIndex * width + width,
        endValue: -nextIndex * width,
        duration: 500, 
        timingFunction: ease,
        template: (progress) => `translateX(${progress}px)`
      }))

      this[STATES].position = nextIndex
      this.triggerEvent('change', nextIndex)
    }
    let timeline = new Timeline()
    timeline.start()
    
    let animationOffsetX = 0
    element.addEventListener('start', (event: GestureEventType) => {
      timeline.pause()
      clearInterval(this[kIntervalHandle])

      // 计算动画偏差
      const duration = this[kDuration]
      const curProgressTime = timeline.getProgress()
      const progress = (curProgressTime - animationStartProgress) < duration ? 0 : curProgressTime - animationStartProgress
      console.log('progress', progress, animationStartProgress, curProgressTime)
      animationOffsetX = ease(progress % duration / duration) * width
    })
    let i = 0
    element.addEventListener('pan', (event: GestureEventType) => {
      const panX = event.clientX - event.startX;
      (i++ % 20 === 0 ) && console.log(panX, animationOffsetX)
      const x = panX - animationOffsetX
      const moveIndex = Math.round(-x / width)
      const curIndex = (this[STATES].position + moveIndex % imageCount + imageCount) % imageCount
      const preIndex = (curIndex - 1 + imageCount) % imageCount
      const nextIndex = (curIndex + 1 + imageCount) % imageCount
      children[preIndex].style.transform = `translateX(${-((preIndex - moveIndex) * width) + x - width }px)`
      children[curIndex].style.transform = `translateX(${-((curIndex - moveIndex) * width) + x }px)`
      children[nextIndex].style.transform = `translateX(${-((nextIndex - moveIndex) * width) + x + width }px)`
    })

    element.addEventListener('end', (event: GestureEventType) => {
      timeline.reset()
      timeline.start()

      const panX = event.clientX - event.startX
      
      let x = panX - animationOffsetX
      const curIndex = (this[STATES].position + Math.round(-x / width) % imageCount + imageCount) % imageCount
      
      

      if(event.isFlick){
        const moveIndex = event.velocity < 0? Math.ceil(panX / width) : Math.floor(panX / width)
        for (let offset of [-1, 0, 1]) {
          const index = (curIndex + offset + imageCount) % imageCount
          timeline.add(new Animation({
            object: children[index].style,
            property: "transform",
            startValue: -((index - moveIndex) * width) + x + width * offset,
            endValue: -((index - moveIndex) * width) + width * offset,
            duration: 500, 
            timingFunction: ease,
            template: (progress) => `translateX(${progress}px)`
          }))
        }
      } else {
        const moveIndex = Math.round(-x / width)
        // console.log(x, panX, animationOffsetX)
        // console.log(preIndex, curIndex, nextIndex, moveIndex)

        for (let offset of [-1, 0, 1]) {
          const index = (curIndex + offset + imageCount) % imageCount
          timeline.add(new Animation({
            object: children[index].style,
            property: "transform",
            startValue: -((index - moveIndex) * width) + x + width * offset,
            endValue: -((index - moveIndex) * width) + width * offset,
            duration: 500, 
            timingFunction: ease,
            template: (progress) => `translateX(${progress}px)`
          }))
        }
      }
      
      

      this[STATES].position = curIndex
      this.triggerEvent('change', curIndex)
      this[kIntervalHandle] = setInterval(nextImage, this[kDuration])
    })
    
    this[kIntervalHandle] = setInterval(nextImage, this[kDuration])
    
  }

  setDuration(duration: number) {
    this[kDuration] = duration
  }

  setImgList(imgList: GeekCarousel.ImgItemType[]) {
    this[kImgList] = imgList
  }

  render() {

    return <div class="carousel">
      {this[kImgList].map(img => {
        const styles = `background-image:url(${img.src})`
        return <div class="carousel--item" style={styles}></div>
      })}
    </div>
  }
}

