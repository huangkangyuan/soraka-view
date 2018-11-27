# Soraka-view

[![vue](https://img.shields.io/badge/vue-2.5.17-brightgreen.svg)](https://github.com/vuejs/vue) [![element-ui](https://img.shields.io/badge/element--ui-2.4.6-brightgreen.svg)](https://github.com/ElemeFE/element) [![spring-boot](https://img.shields.io/badge/spring--boot-1.5.15.RELEASE-blue.svg)](https://spring.io/projects/spring-boot) [![spring-cloud](https://img.shields.io/badge/spring--cloud-Edgware.SR4-blue.svg)](https://spring.io/projects/spring-cloud) [![license](https://img.shields.io/badge/license-Apache%202.0-green.svg)](https://gitee.com/beiyoufx/soraka)

- 前后端完全分离，基于`Spring Boot 1.5.15.RELEASE`
- 基于网关的统一权限管理，更高效更方便
- 基于`Spring Security OAuth`实现按钮级细粒度权限控制
- `Apache LICENSE 2.0`，完全开源
- 基于`Vue 2.0`的后台解决方案
- 基于饿了么`Element UI`

**交流QQ群：808305454**

# 项目介绍

Soraka一个基于Spring Cloud的基础通用开发框架，有高效率，低封装的特点，非常适合学习和中小企业直接作为开发框架使用。

Soraka View是Soraka的后台UI项目。

主要包含如下功能：

- 用户管理：完整的用户管理授权体系
- 部门管理：配置系统组织机构，树结构展现，可随意调整上下级
- 菜单管理：配置系统菜单，操作权限，按钮权限标识，图标等
- 角色管理：角色菜单权限分配，最新的基于资源的权限控制（new RBAC）

#### 软件架构

前端技术选型

| 名称               | 版本   | 说明         | 官网                                            |
| ------------------ | ------ | ------------ | ----------------------------------------------- |
| webpack            | 4.16.5 | 前端项目构建 | https://webpack.github.io/                      |
| nodejs             | >6.0.0 | 运行环境     | https://nodejs.org/en/                          |
| npm                | >3.0.0 | 包管理工具   | https://www.npmjs.com/                          |
| vue                | 2.5.17 | 前端框架     | https://github.com/vuejs/vue                    |
| element-ui         | 2.4.6  | UI组件       | https://element.eleme.io/#/                     |
| axios              | 0.18.0 | 网络组件     | https://github.com/axios/axios                  |
| nprogress          | 0.2.0  | 进度条       | https://github.com/rstacruz/nprogress           |
| vuex               | 3.0.1  | 前端状态管理 | https://github.com/vuejs/vuex                   |
| vue-router         | 3.0.1  | 前端路由     | https://github.com/vuejs/vue-router             |
| vue-admin-template |        | 后台模板     | https://github.com/PanJiaChen/vue-element-admin |

#### 安装教程

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:59
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

#### 使用说明

1. 需要先安装node环境

2. 编译需要Python

3. IDE工具推荐使用Visual Studio Code

# 文档

1. [快速开始](https://gitee.com/beiyoufx/soraka/blob/master/soraka-wiki/%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B.md)

# 演示

![Soraka演示](https://gitee.com/beiyoufx/soraka-view/raw/master/demo.gif)

# 关注我们

公众号 **Java实践笔记**

分享Java开发中常用的技术，分享软件开发的新技术，分享业内相关的解决方案和互联网资讯，让自己做一个紧跟时代潮流的程序猿~

![img](https://gitee.com/beiyoufx/soraka-view/raw/master/javanoteqr.jpg)