---
title: npm私有仓库使用文档
date: 2019-6-5 11:36:17
tags: ["基础架构"]
category: 前端
prev: ../npm私有仓库搭建文档
next: ../自制画板
sticky: true
comments: true
---

# 前言

私有 npm 仓库可以让我们使用包就像 npm 官方仓库里的包一样方便。

<!-- more -->


## 为什么搭建npm私有仓库：

*   可以将公共方法库和公共组件库进行统一的版本管理；
    
*   私有包托管在内部服务器或者单独的服务器上，可以防止不必要的业务代码泄露；
    
*   可以同步整个官方仓库，也可以只同步需要的；
    
*   下载的时候，可以让公共包走公共仓库，私有包走私有仓库；
    
*   可以缓存下载过的包；
    
*   对于下载，发布，有对应的权限管理；
    

# 使用流程

## 安装开发环境

node、npm

## 将npm的registry连至公司npm私有仓库

在命令行中输入

npm config set registry url

## 使用

正常通过 npm install 下载资源

# 发布流程

## 注册npm私有仓库账号

1、输入 npm adduser

2、依次输入username，password，email

注册后无需重复注册

## 登录npm私有仓库

1、输入 npm login

2、依次输入username，password，email

## 发布包

1、进入打包完成的仓库，修改package.json对应版本信息

2、输入 npm publish

# 查询方式

可以进入 url 查询已上传过的包
