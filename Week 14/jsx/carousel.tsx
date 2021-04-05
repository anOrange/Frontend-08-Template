import { BaseComponent, React, ElementWrapper } from './framework.ts'

export default class Carousel extends BaseComponent {

  didMounted() {
    const eWarp = this.root as ElementWrapper
    const element: HTMLElement = eWarp.root
    element.addEventListener('mousedown', (e) => {
      console.log(e.clientX)
      
      const move = (e) => {
        console.log('mousemove', e.clientX)
      }
      const up = (e) => {
        console.log('mouseup', e.clientX)
        document.removeEventListener('mouseup', up)
        document.removeEventListener('mousemove', move)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    })
  }

  render() {

    const srcList = [ 
      'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
      'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
      'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
      'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'
    ]

    return <div class="carousel">
      {srcList.map(src => {
        const styles = `background-image:url(${src})`
        return <div class="carousel--item" style={styles}></div>
      })}
    </div>
  }
}

