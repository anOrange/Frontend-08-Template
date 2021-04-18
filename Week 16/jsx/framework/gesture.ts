/*
 * @Description: 手势封装，GestureRecognizer
 * @Author: zhuo.pan
 * @Date: 2021-04-11 19:26:54
 * @LastEditTime: 2021-04-18 21:29:36
 * @LastEditors: zhuo.pan
 */

type ListenerContext = Partial<{
  startX?: number
  startY?: number

  isTap: boolean
  isPan: boolean
  isPress: boolean
  isFlick: boolean

  isVertical: boolean
  velocity: number

  points: Array<Point>

  handler: number  // 定时器
}>

type Point = {
  t: number,
  x: number,
  y: number
}

const kMousePre = 'mouse_'
const kTouchPre = 'touch_'

export class Listener {
  protected recognizer: Recognizer
  protected element: HTMLElement

  startX: number
  startY: number

  constructor(element: HTMLElement, recognizer: Recognizer) {
    if (!(element instanceof HTMLElement)) {
      throw new Error('element must be HTMLElement')
    }
    if (!recognizer) {
      throw new Error('recognizer must be instance of Recognizer')
    }
    this.element = element
    this.recognizer = recognizer
    this.init()
  }

  init() {

    const recognizer = this.recognizer
    const element = this.element

    element.addEventListener('contextmenu', (event) => {
      event.stopPropagation()
    }, {
      capture: true,
      passive: true
    })

    let isListeningMouse = false
    let contexts = new Map<string, ListenerContext>()

    element.addEventListener('mousedown', (event) => {

      const context = Object.create(null)
      contexts.set(kMousePre + (1 << event.button), context)

      this.recognizer?.start?.(event, context)
      const move = (event: MouseEvent) => {
        let button = 1
          while(button <= event.buttons) {
            if (button & event.buttons) {
              // order of buttons & button propery is not same
              let key
              if (button === 2) {
                key = 4
              } else if (button === 4) {
                key = 2
              } else {
                key = button
              }
              let context = contexts.get(kMousePre + key)
              this.recognizer?.move?.(event, context)
            }
            button = button << 1
          }
      }
      const up = (event: MouseEvent) => {
        let context = contexts.get(kMousePre + (1 << event.button))
        recognizer.end?.(event, context)
        contexts.delete(kMousePre + (1 << event.button))
        if (event.buttons === 0) {
          document.removeEventListener('mousemove', move)
          document.removeEventListener('mouseup', up)
          isListeningMouse = false
        }
      }
      if (isListeningMouse == false) {
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', up)
        isListeningMouse = true
      }
    })

    this.element.addEventListener('touchstart', (event) => {
      for (const point of Array.from(event.changedTouches)) {
        let context = Object.create(null)
        contexts.set(kTouchPre + point.identifier, context)
        recognizer.start?.(point, context)
      }
    })

    this.element.addEventListener('touchmove', (event) => {
      for (const point of Array.from(event.changedTouches)) {
        const context = contexts.get(kTouchPre + point.identifier)
        recognizer?.move?.(point, context)
      }
    })

    this.element.addEventListener('touchend', (event) => {
      for (const point of Array.from(event.changedTouches)) {
        const key = kTouchPre + point.identifier
        const context = contexts.get(key)
        recognizer?.end?.(point, context)
        contexts.delete(key)
      }
    })

    this.element.addEventListener('touchcancel', (event) => {
      for (const point of Array.from(event.changedTouches)) {
        const key = kTouchPre + point.identifier
        const context = contexts.get(key)
        this.recognizer?.end?.(point, context)
        contexts.delete(key)
      }
    })
  }

}

interface EventPoint {
  clientX: number
  clientY: number
}


export class Recognizer {
  dispatcher: Dispatcher

  startX: number
  startY: number


  constructor(dispatcher: Dispatcher) {
    this.dispatcher = dispatcher
  }

  start(point: EventPoint, context: ListenerContext) {
    context.startX = point.clientX, context.startY = point.clientY

    context.points = [
      {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY,
      }
    ]

    this.dispatcher?.dispatch?.('start', {
      clientX: point.clientX,
      clientY: point.clientY,
    })

    context.isTap = true
    context.isPan = false
    context.isPress = false

    context.handler = window.setTimeout(() => {
      context.isTap = false
      context.isPan = false
      context.isPress = true
      context.handler = null
      this.dispatcher?.dispatch?.('press', {})
    }, 500)
  }

  move(point: EventPoint, context: ListenerContext) {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isTap = false
      context.isPan = true
      context.isPress = false
      context.isVertical = Math.abs(dx) < Math.abs(dy),
      this.dispatcher.dispatch('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      })
      clearTimeout(context.handler)
    }
  
    if (context.isPan) {
      this.dispatcher.dispatch('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      })
    }
  
    context.points = context.points.filter(point => Date.now() - point.t < 500)
  
    context.points.push(
      {
        t: Date.now(),
        x: point.clientX,
          y: point.clientY,
        }
      )
  }

  end(point: EventPoint, context: ListenerContext) {
    if (context.isTap) {
      clearTimeout(context.handler)
      this.dispatcher?.dispatch?.('tap', {})
    }
    if (context.isPress) {
      this.dispatcher?.dispatch?.('pressend', {})
    }
    context.points = context.points.filter(point => Date.now() - point.t < 500)
    let v: number
    if (!context.points.length) {
      v = 0
    } else {
      let d = Math.sqrt((point.clientX - context.points[0].x) ** 2 +
            (point.clientY - context.points[0].y) ** 2)
      v = d / (Date.now() - context.points[0].t)
    }
  
    if (v > 1.5) {
      this.dispatcher?.dispatch?.('flick', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v,
      })
      context.isFlick = true
    } else {
      context.isFlick = false
    }

    if (context.isPan) {
      this.dispatcher?.dispatch?.('panend', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
      })
    }
    this.dispatcher?.dispatch?.('end', {
      startX: context.startX,
      startY: context.startY,
      clientX: point.clientX,
      clientY: point.clientY,
      isVertical: context.isVertical,
      isFlick: context.isFlick,
    })
  }

  cancel(point: EventPoint, context: ListenerContext) {
    this.dispatcher.dispatch('cancel', {})
    clearTimeout(context.handler)
  }

}

export class Dispatcher {
  
  element?: HTMLElement

  constructor(element: HTMLElement) {
    this.element = element
  }

  dispatch(type: string, properties?: any) {
    const event = new CustomEvent(type)
    for (const prop in properties) {
      event[prop] = properties[prop]
    }
    this.element?.dispatchEvent(event)
  }
}

export function gestureEnable(element: HTMLElement) {
  new Listener(element, new Recognizer(new Dispatcher(element)))
}


