class Dog {
  constructor(name) {
    this.name = name
  }
  action(text) {
    return this.name + ' ' + text
  }
}

class Human {
  constructor(name) {
    this.name = name
  }
  hurt(action) {
     console.log(action + ' ' + this.name)
  }
}

let dog = new Dog('大黄')
let man = new Human('张三')
man.hurt(dog.action('咬'))
