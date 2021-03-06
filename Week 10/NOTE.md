# weeks1~10学习笔记

## 1~5周编程训练

1. 第一周通过一个简单的AI游戏练习，引导引入课程
2. 第二周实现了一个更丰富的寻路算法
    - 用纯JavaScript和原生html实现的地图，用多了框架之后，多熟悉下原生HTML还是很必要的
    - 用异步方式练习了可视化搜索过程，这个时候还能稍微做下简单的封装
    - 用到了A*启发式搜素算法，这个在以前校招游戏面试很可能会问到
3. 第三周学习了简单的编译原理原理知识
    - 用了词法和语法分析，构建四则运算的ast
    - LL算法学了很多年，现在忘得差不多了，这个值得课下花时间好好研究下
4. 第四周学习的是字符串匹配算法
    - 开始讲了 trie 树，这是很有用，而且实现相对简单的算法
    - 第二个讲到了很经典的KMP算法，这个算法尽量要做到能徒手流畅的写出来
    - 通配符匹配的编程练习，做一做，练练手
5. 第五周学习Proxy实现简单的toy reactive，已经 DOM 的精确操作
    1. DOM 的精确操作还是经常会用到的，提到了 document 来监听鼠标事件，防止鼠标滑出屏幕，之前还是没有注意过的。

## 6、7周JavaScript基础

从程序语言分类开始，介绍了语言的分类方法，帮助我们从新认识市面上的各种语言，对JavaScript产生不同角度的理解。

1. 产生式：经过语法和词法分析，推到得到的复合文法规则的语句
2. 我们再编译程序语言中，理想状况是得到上下文无关文法
3. 图灵完备：在可计算性理论里，如果一系列操作数据的规则（如指令集、编程语言、细胞自动机）可以用来模拟单带图灵机，那么它是图灵完备的。

6周7到11课学习了JavaScript的基础类型，以及JavaScript的对象

JavaScript对象：

JavaScript运算法和表达式：

JavaScript的隐式类型转换比较容易出现问题，要尽量避免出现

## 8~10周学习浏览器工作原理

toy浏览器大体工作原理

> http request → html → dom → css → layout → render

1. http，基于tcp 协议的应用层浏览器协议
    1. 基于文本进行传输
    2. 请求和返回结构
2. 使用状态机对服务端返回文本进行分析，得到 response 对象
3. 使用状态机对 body (HTML) 进行分析得到 dom 树
4. 使用 css 库来解析 css 文本，得到样式规则
5. JavaScript写逻辑去匹配样式，得到带样式的 css 树
6. 对网页 flex 布局进行排版
    1. 在闭合标签进行处理，这样能获取到标签的子元素
    2. 初始化元素样式，补充默认样式，设置 mainSize、mainStart、crossSize 表示的属性
    3. 计算主轴，根据剩余空间去拉升和换行
    4. 计算交叉轴，确认元素交叉轴空间大小和位置
7. 使用 images 库在node中绘制渲染树

## 学习总结

学习的时候，跟着老师的课程，看着视频，敲完代码是很容易的。但是感觉这样很难消化吸收。

- 一方面，视频内容比较短，但是背后的东西很多，需要课下去查很懂资料。自己不动手去看资料，很多东西是没有看到的。
- 其二是跟着视频敲代码，老师帮趟的坑，自己就碰不到了。丢掉了很多细节，没有得到拆坑解决问题里面学到的东西。
- 第三是缺少了自己思考的过程，记忆比较浅。

这次写比较还是有收获的。回去翻之前学的东西，会去回想之前做的东西。不然感觉会忘得差不多了。如果有做笔记，建立知识图谱的习惯，对自己应该帮助很大。

有人一起按进度学习，做作业，还是很有用的。这些学习资料网上也有很多，但是自己在家里的时候，往往坚持不下去。这次学习，就算经常拖到周日晚上才做，但也坚持下来，跟上了进度。
