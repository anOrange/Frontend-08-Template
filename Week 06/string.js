let testText = '极客时间'
function encodeString(str) {
  console.log(str)
  let stringBytes = []
  for (let i = 0; i < str.length; i++) {
    let codePoint = str.codePointAt(i)
    let byteCount = 0
    let bytes = []
    while (codePoint > 0) {
      bytes.unshift(codePoint & 0b00111111)
      // 每个字节对多只能存 6 个比特位
      codePoint = codePoint >> 6
      byteCount++
    }
    // 构造头左边标志位
    let right = 0;
    for(let i = 0; i < byteCount; i++) {
      right = right | (1 << (7 - i))
    }
    // 判断标志位信息是否与存储字节冲突
    if (bytes[0] & (right | (1 << byteCount))) {
      right = right | (1 << byteCount) // 表示位扩充一位
      byteCount++ // 多占用一字节保存标志位
    }
    // 给各个字节补上标志位
    bytes = bytes.map(num => num | 0b10000000)
    bytes[0] = bytes[0] | right
    stringBytes.push(...bytes)
  }
  // 转换成ArrayBuffer
  let byteBuffer = new Uint8Array(stringBytes)
  console.log(byteBuffer)
  return byteBuffer.buffer
}

let result = encodeString(testText)
encodeString('中国')
encodeString('一个橙子')
