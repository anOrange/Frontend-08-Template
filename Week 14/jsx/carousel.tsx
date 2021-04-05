import { BaseComponent, React, ElementWrapper } from './framework.ts'

export default class Carousel extends BaseComponent {

  position: number = 0
  width = 500

  didMounted() {
    const eWarp = this.root as ElementWrapper
    const element: HTMLElement = eWarp.root
    const children = Array.from(element.children) as Array<HTMLElement>

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
  }

  render() {

    const srcList = [ 
      // 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
      // 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
      // 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
      // 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
      './img/0.jpg',
      './img/1.jpg',
      './img/2.jpg',
      './img/3.jpg'
    ]

    return <div class="carousel">
      {srcList.map(src => {
        const styles = `background-image:url(${src})`
        return <div class="carousel--item" style={styles}></div>
      })}
    </div>
  }
}

