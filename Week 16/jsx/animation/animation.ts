/*
 * @Description: 
 * @Author: zhuo.pan
 * @Date: 2021-04-11 19:27:08
 * @LastEditTime: 2021-04-19 02:49:31
 * @LastEditors: zhuo.pan
 */

const TICK = Symbol("tick")
const TICK_HANDLER = Symbol("tivk-handler")
const ANIMATIONS = Symbol("animations")
const START_TIME = Symbol("start-time")
const PAUSE_START = Symbol("pause-start")
const PAUSE_TIME = Symbol("pause-time")
const TIME_PROGRESS = Symbol('time-progress')

enum TimelineState {
  Inited = 0,
  Started = 1,
  Paused = 2
}
export class Timeline {
  state: TimelineState
  [PAUSE_TIME]: number   // 动画暂停时间，恢复的时候需要减去这个时间
  [ANIMATIONS]: Set<Animation> // 控制的动画
  [START_TIME]: Map<Animation, number>  // 各个动画的开始时间
  [TICK_HANDLER]: number    // 保存Tick的句柄
  [TICK]: FrameRequestCallback
  [TIME_PROGRESS]: number    // 动画的时间进度


  constructor() {
    this.state = TimelineState.Inited
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map<Animation, number>()
    this[TIME_PROGRESS] = 0
  }

  getProgress() {
    return this[TIME_PROGRESS]
  }

  start() {
    if (this.state !== TimelineState.Inited)
      return
    this.state = TimelineState.Started
    const startTime = Date.now()
    this[PAUSE_TIME] = 0
    this[TICK] = () => {
      this[TIME_PROGRESS] = Date.now() - startTime - this[PAUSE_TIME]  // 时间进度
      this[ANIMATIONS]?.forEach(animation => {
        let t: number = this[TIME_PROGRESS] - this[START_TIME].get(animation) - animation.delay  
        if (animation.duration < t) {
          if ((animation.repeat === 0) ||
          (t / animation.duration > animation.repeat + 1)) { // 循环结束
            this[ANIMATIONS].delete(animation)
            t = animation.duration
          } else {
            // 永久循环
            t = t % animation.duration
          }
        }
        // 考虑delay因素，大于0才出发
        if (t > 0) {
          animation.receive(t)
        }
      })
      
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
    }
    this[TICK](0)
  }

  pause() {
    if (this.state !== TimelineState.Started)
      return
    this.state = TimelineState.Paused
    cancelAnimationFrame(this[TICK_HANDLER])
    this[PAUSE_START] = Date.now() //记录暂停开始的时间
    // this[PAUSE_TIME] = this[TIME_PROGRESS]
  }
  resume() {
    if (this.state !== TimelineState.Paused)
      return
    this.state = TimelineState.Started
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
    this[TICK](0)
  }
  reset() {
    this.pause()
    this.state = TimelineState.Inited
    this[PAUSE_TIME] = 0
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
    this[PAUSE_START] = 0
    this[TICK_HANDLER] = null
    this[TIME_PROGRESS] = 0
  }
  add(animation: Animation, startTime?: number) {
    if (arguments.length < 2) {
      //时间少于2的时候添加默认值
      startTime = this[TIME_PROGRESS]
    }
    this[ANIMATIONS].add(animation)
    this[START_TIME].set(animation, startTime)
  }
}


type AnimationOptions = {
  object,
  property: string | symbol | number,
  startValue: number,
  endValue: number, 
  duration: number, 
  delay?: number,
  repeat?: number | boolean
  timingFunction: (timeProgress: number) => number, 
  template: (progress: number) => any
}

export const createAnimationOptions = (object: any,
  property: string | number | symbol,
  startValue: number, endValue: number, duration: number, delay: number, repeat: number | boolean, timingFunction, template) => ({
  object,
  property,
  repeat,
  startValue, endValue, duration, delay, timingFunction, template
})

export class Animation {
  object: any
  property: string | symbol | number
  startValue: number
  endValue: number
  duration: number
  delay: number
  repeat: number
  timingFunction: (timeProgress: number) => number
  template: (progress: number) => any
  constructor({
    object,
    property,
    repeat = 0,
    startValue, endValue, 
    duration = 250,
    delay = 0, 
    timingFunction, 
    template
  }: AnimationOptions) {
    timingFunction = timingFunction || (v => v)
    template = template || (v => v)
    this.object = object
    this.property = property
    this.startValue = startValue
    this.endValue = endValue
    this.duration = duration
    this.delay = delay
    if (repeat === true) {
      this.repeat = -1
    } else if (typeof repeat === 'number') {
      this.repeat = repeat
    } else {
      this.repeat = 0
    }
    this.timingFunction = timingFunction
    this.template = template
  }
  receive(time) {
    time = +time
    const rage = this.endValue - this.startValue
    const progress = this.timingFunction(time / this.duration)
    this.object[this.property] = this.template(this.startValue + rage * progress)
  }
}