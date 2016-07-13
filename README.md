# Question Service API Reference 0.1.0

***

Question Service 运行环境，适用于研发及部署。

本镜像提供：

* question service 0.1.0
* Node.js 4.3.0
* Npm 3.8.7
* Node Packages:
    - grunt
    - json-server 0.8.14

继承关系：question service -->nodejs

# 使用说明

***

**主要文件**

名称 |位置              |说明
--------|--------------------------|-----------------
初始化 | /script/runonce_question.sh   | 只有首次启动执行

### PORTS

请在创建container时指定端口映射，本镜像推荐端口：
端口  | 说明     |推荐
3000| 常见端口  |√

### ENV

无

### VOLUME

container路径  | Host存放位置  | 说明
-------------|--------------|------------------
/data/log | logcenter   | 继承自alpine
/data/persist  |datacenter  | 继承自alphine
/data/app |datacenter  |不建议代码做volume

# 实例

***

### Quickstart

```
question:
  image: reg.example.com/question:latest
  ports:
  	- "41201:3000"
  volumes:
  	- /var/lib/docker/vfs/dir/logcenter/question.localhost:/data/log
  	- /var/lib/docker/vfs/dir/datacenter/question.localhost:/data/persist
  environment:
  	- EMAIL=user@example.com
  	- ENGINE=localhost
  hostname: question.localhost
```

### Link Container

Node.js项目常采用MongoDB，本例子说明如何将nodejs与mongo进行linking。

```
db:
   image:reg.example.com/mongo:latest
   ports:
   	 - "41203:27017"
   	 - "41204:28017"
   volumes:
     - /var/lib/docker/vfs/dir/logcenter/question-db.example.com:/data/log
     - /var/lib/docker/vfs/dir/dbcenter/question-db.example.com:/data/db
     - /var/lib/docker/vfs/dir/datacenter/question-db.example.com:/data/persist
   links:
     - db:db
   environment:
     - EMAIL=user@example.com
   hostname: question.example.com
```
