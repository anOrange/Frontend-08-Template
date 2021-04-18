import { BaseComponent, React, ElementWrapper, ATTRIBUTES, STATES } from '../framework/framework'
import { gestureEnable } from '../framework/gesture'
import { Timeline, Animation } from '../animation/animation'
import { ease } from '../animation/timingFunctions'

const kDuration = Symbol('duration')
const kOnChanged = Symbol('on-changed')
const kImgList = Symbol('img-list')

namespace GeekCarousel {
  export type ImgItemType = {
    src: string,
    title?: string
  }
}

export default class Carousel extends BaseComponent {

  // STATES
  position: number = 0

  // ATTRIBUTES
  ;width = 500
  ;[kDuration] = 2000
  ;[kOnChanged] = (position: number) => {}
  ;[kImgList]: GeekCarousel.ImgItemType[] = []

  constructor() {
    super()
    this[kImgList] = []
  }

  didMounted() {
    
    const eWarp = this.root as ElementWrapper
    const element: HTMLElement = eWarp.root
    gestureEnable(element)

    const children = Array.from(element.children) as Array<HTMLElement>
    const imageCount = children.length

    element.addEventListener('start', event => {

    })

    element.addEventListener('pan', event => {

    })

    element.addEventListener('end', event => {

    })
    const width = this[ATTRIBUTES].width || 500
    let t = new Timeline()
    t.start()
    setInterval(() => {
      let nextIndex = (this.position + 1) % imageCount
      t.add(new Animation({
        object: children[this.position].style,
        property: "transform",
        startValue: -this.position * width,
        endValue: -this.position * width - width,
        duration: 500, 
        timingFunction: ease,
        template: (progress) => `translateX(${progress}px)`
      }))
      t.add(new Animation({
        object: children[nextIndex].style,
        property: "transform",
        startValue: -nextIndex * width + width,
        endValue: -nextIndex * width,
        duration: 500, 
        timingFunction: ease,
        template: (progress) => `translateX(${progress}px)`
      }))

      this.position = nextIndex
    }, this[kDuration])
    

    /*
    element.addEventListener('mousedown', (e) => {
      const width = this.width
      const startX = e.clientX
      console.log(e.clientX)
      const curIndex = (Math.round(this.position / width) + children.length) % children.length
      const preIndex = (curIndex - 1 + children.length) % children.length
      const nextIndex = (curIndex + 1 + children.length) % children.length
      console.log('curIndex', curIndex, preIndex, nextIndex)
      children.forEach((child: HTMLElement) => {
        child.style.transition = 'none'
      })
      const move = (e) => {
        const distance = startX - e.clientX
        const offsetX = this.position % 500
        children[preIndex].style.transform = `translateX(${-(preIndex * width) - distance - width - offsetX }px)`
        children[curIndex].style.transform = `translateX(${-(curIndex * width) - distance - offsetX }px)`
        children[nextIndex].style.transform = `translateX(${-(nextIndex * width) - distance + width - offsetX }px)`
      }
      const up = (e) => {
        const distance = startX - e.clientX
        document.removeEventListener('mouseup', up)
        document.removeEventListener('mousemove', move)
        this.position = distance + this.position
        // 计算进的索引
        const curIndex_n = (Math.round(this.position / width) + children.length) % children.length
        const preIndex_n = (curIndex_n - 1 + children.length) % children.length
        const nextIndex_n = (curIndex_n + 1 + children.length) % children.length

        // children.forEach((child: HTMLElement) => {
        //   child.style.transition = ''
        // })
        const arr = [curIndex, preIndex, nextIndex]
        console.log('arr', arr)
        arr.forEach(index => {
          children[index].style.transition = ''
        })
        
        setTimeout(() => {
          this.position = curIndex_n * width
          children[preIndex_n].style.transform = `translateX(${-(preIndex_n * width) - width }px)`
          children[curIndex_n].style.transform = `translateX(${-(curIndex_n * width)}px)`
          children[nextIndex_n].style.transform = `translateX(${-(nextIndex_n * width) + width }px)`
          // setTimeout(() => {
          //   children.forEach((child: HTMLElement) => {
          //     child.style.transition = ''
          //   })
          // }, 16);
        }, 16);
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
      move(e)
    })
    */
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

