学习笔记

在 MDN 上面找到的
> CSS 伪元素 ::first-letter会选中某 block-level element（块级元素）第一行的第一个字母，并且文字所处的行之前没有其他内容（如图片和内联的表格）。
[first-letter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-letter#%E5%85%81%E8%AE%B8%E7%9A%84%E5%B1%9E%E6%80%A7%E5%80%BC)


> ::first-line CSS pseudo-element （CSS伪元素）在某 block-level element （块级元素）的第一行应用样式。第一行的长度取决于很多因素，包括元素宽度，文档宽度和文本的文字大小。
[first-line](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-line#%E5%85%81%E8%AE%B8%E7%9A%84%E5%B1%9E%E6%80%A7%E5%80%BC)

里面允许元素，::first-line 没有 float， ::first-letter 里面是有的。没有写得不是很明白。
* 从实现上面去猜想，是不是 first-letter 有明确的选择元素，first-line 没有明确的选择元素。
* 从使用的功能性上面想，好像 first-line 使用 float 属性，好像没有特别打的用处。而 first-letter 可以做文字环绕，用得比较多。


first-line 只能用在块级元素里面。

