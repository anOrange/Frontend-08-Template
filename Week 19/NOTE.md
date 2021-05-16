学习笔记

服务端文件上传指令:
```shell
rsync -av -e ssh --exclude="node_modules" ./server work@geek.skyvoid.com:/home/work/geek/week19 
```

