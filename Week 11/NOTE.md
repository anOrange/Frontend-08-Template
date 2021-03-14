学习笔记

## 在 MDN 上面找到的
> CSS 伪元素 ::first-letter会选中某 block-level element（块级元素）第一行的第一个字母，并且文字所处的行之前没有其他内容（如图片和内联的表格）。
[first-letter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-letter#%E5%85%81%E8%AE%B8%E7%9A%84%E5%B1%9E%E6%80%A7%E5%80%BC)


> ::first-line CSS pseudo-element （CSS伪元素）在某 block-level element （块级元素）的第一行应用样式。第一行的长度取决于很多因素，包括元素宽度，文档宽度和文本的文字大小。
[first-line](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-line#%E5%85%81%E8%AE%B8%E7%9A%84%E5%B1%9E%E6%80%A7%E5%80%BC)


里面允许元素，::first-line 没有 float， ::first-letter 里面是有的。没有写得不是很明白。

## 思考
* 从实现上面去猜想，是不是 first-letter 有明确的选择元素，first-line 没有明确的选择元素。实现难度比较大。
* 从使用的功能性上面想，好像 first-line 使用 float 属性，好像没有特别打的用处。而 first-letter 可以做文字环绕，用得比较多。

## 查资料

看到 blink 的代码中，FirstLetterPseudoElement 继承自 PseudoElement，::fisrt-line 只是 line_info 中命名为的 is_first_line_ 的私有属性(同时还有is_last_line_)，可以通过 bool IsFirstLine() const 来获取。去普通行相比，::first-line 在计算样式时，根据这一属性来区别来生成 ComputedStyle。  

可以看出，伪元素 ::first-letter 是当做一个dom来处理的，而 ::fisrt-line 只是在 layout 里，有特殊标记，处理文本时给予特殊处理。  

设想，如果将当做 ::first-line 当做一个脱离文档流的 dom 来参与布局。随着样式的改变，文字就会在两个不同的 dom 之间穿梭，dom 的结构就很改变。而 ::first-letter 本身就选择了首字母，就不会出现这个问题。

[line_info.h](https://github.com/chromium/chromium/blob/99314be8152e688bafbbf9a615536bdbb289ea87/third_party/blink/renderer/core/layout/line/line_info.h)
[first_letter_pseudo_element.cc](https://github.com/chromium/chromium/blob/99314be8152e688bafbbf9a615536bdbb289ea87/third_party/blink/renderer/core/dom/first_letter_pseudo_element.cc)
[line_width.cc](https://github.com/chromium/chromium/blob/99314be8152e688bafbbf9a615536bdbb289ea87/third_party/blink/renderer/core/layout/line/line_width.cc)
[layout_text_fragment.cc]https://github.com/chromium/chromium/blob/99314be8152e688bafbbf9a615536bdbb289ea87/third_party/blink/renderer/core/layout/layout_text_fragment.cc
[:first-line in the CSS3 spec](https://www.w3.org/TR/selectors-3/#first-line)
[:first-line in the CSS2.1 spec](https://www.w3.org/TR/CSS2/selector.html#first-line-pseudo)
