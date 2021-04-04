/**
 * 组件封装方法
 */
namespace Week14 {
  export interface ComponentConstructor {
    new (type?: string): ComponentInterface
  }
  
  export interface ComponentInterface {
    mountTo(parent: HTMLElement) : void
    setAttribute(attr: string, value: string) : void
    appendChild(child: HTMLElement | Text | ComponentInterface) : void
    render() : HTMLElement | Text
  }
}

export function createElement(type: string | Week14.ComponentConstructor, attribute?: Record<string, string>, ...children: Array<Week14.ComponentInterface>) {
  if (!type) {
    return null
  }
  let element: Week14.ComponentInterface
  if (typeof type === 'string') {
    element = new ElementWrapper(type)
  } else {
    element = createComponent(<Week14.ComponentConstructor>type)
  }
  
  for (let attr in attribute) {
    element.setAttribute(attr, attribute[attr])
  }

  for (let child of children) {
    if (typeof child === 'string') {
      child = new TextWarpper(child)
    }
    element.appendChild(child)
  }

  return element
}

export const React = {
  createElement
}

export class ElementWrapper implements Week14.ComponentInterface {
  root: HTMLElement
  type: string

  constructor(type?: string) {
    this.type = type || 'div'
    this.root = this.render()
  }

  setAttribute(attr: string, value: string) {
    this.root.setAttribute(attr, value)   
  }

  mountTo(parent: HTMLElement) {
    parent.appendChild(this.root)
  }
  appendChild(child: HTMLElement) {
    this.mountTo(this.root)
  }
  render() {
    return document.createElement(this.type)
  }

}

class TextWarpper implements Week14.ComponentInterface {
  root: Text
  content: string

  constructor(content?: string) {
    this.content = content || ''
    this.root = this.render()
  }

  setAttribute(attr: string, value: string) {
  }

  mountTo(parent: HTMLElement) {
    parent.appendChild(this.root)
  }
  appendChild(child: HTMLElement) {
    // this.mountTo(this.root)
  }
  render() {
    return document.createTextNode(this.content)
  }
}

function createComponent(cmpConstructor: Week14.ComponentConstructor, type?: string): Week14.ComponentInterface {
  return new cmpConstructor(type);
}

export class BaseComponent implements Week14.ComponentInterface {
  root: HTMLElement
  constructor() {
    this.root = this.render()
  }

  mountTo(parent: HTMLElement) {
    parent.appendChild(this.root)
  }

  setAttribute(attr: string, value: string) {
    
  }

  appendChild() {

  }

  render() {
    return document.createElement('div')
  }

}

