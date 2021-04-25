学习笔记

## 运行
```
  cd generator-vue-exam
  npm lint
  cd ../vuedemo
  yo vue-exam
```

## 遇到问题
1. 使用 npm 安装 yeoman-generator 时，没有加版本号，当前默认安装的版本为5.2.0，导致运行时报:
   > this.npmInstall is not a function

   将 yeoman-generator 版本降到 4.13.0 解决了
2. vue-loader@16 的版本，也会报错，将版本降到 ^15.9.6 解决
3. vue-loader-plugin@1.3.0 插件使用报错，改用 vue-loader/lib/plugin 

用 vue 的时候，要注意各种插件版本匹配，可以到 vue 的仓库查询 [vue2仓库](https://github.com/vuejs/vue) 。
