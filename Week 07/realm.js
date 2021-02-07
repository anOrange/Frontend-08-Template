/*
 * @Description: 
 * @Author: zhuo.pan
 * @Date: 2021-02-06 23:12:09
 * @LastEditTime: 2021-02-06 23:15:07
 * @LastEditors: zhuo.pan
 */

// 进制转换
let aa = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']
function NumberToString(num, jinzhi = 10) {
  let i = num % jinzhi
  num = (num / jinzhi) >> 0
  let list = []
  while(num) {
    list.push(i)
    i = num % jinzhi
    num = (num / jinzhi) >> 0
  }
  list.push(i)
  list = list.reverse().map(i => aa[i])
  console.log(list)
  return list.join('')
}

let a = NumberToString(198, 16)
console.log(a)