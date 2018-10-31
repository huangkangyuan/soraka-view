<template>
  <div class="dashboard-container">
    <div class="banner-text">
      <h2>Soraka 一个基于Spring Cloud的微服务通用开发框架</h2>
      <span align="center">
        <a href="https://github.com/vuejs/vue" target="_blank">
          <img src="https://img.shields.io/badge/vue-2.5.17-brightgreen.svg" alt="vue">
        </a>
        <a href="https://github.com/ElemeFE/element" target="_blank">
          <img src="https://img.shields.io/badge/element--ui-2.4.6-brightgreen.svg" alt="element-ui">
        </a>
        <a href="https://spring.io/projects/spring-boot" target="_blank">
          <img src="https://img.shields.io/badge/spring--boot-1.5.15.RELEASE-blue.svg" alt="spring-boot">
        </a>
        <a href="https://spring.io/projects/spring-cloud" target="_blank">
          <img src="https://img.shields.io/badge/spring--cloud-Edgware.SR4-blue.svg" alt="spring-cloud">
        </a>
        <a href="https://gitee.com/beiyoufx/soraka" target="_blank">
          <img src="https://img.shields.io/badge/license-Apache 2.0-green.svg" alt="license">
        </a>
      </span>
      <br>
      <span>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="项目简介" name="1">
            <a href="https://gitee.com/beiyoufx/soraka" target="_blank">
              <div>前后端完全分离，基于Spring Boot 1.5.15.RELEASE</div>
              <div>基于网关的统一权限管理，更高效更方便</div>
              <div>基于Spring Security OAuth实现按钮级细粒度权限控制</div>
              <div>Apache LICENSE 2.0，完全开源</div>
            </a>
          </el-collapse-item>
          <el-collapse-item title="获取源码" name="2">
            <div>
              开源中国：<a href="https://gitee.com/beiyoufx/soraka" target="_blank">https://gitee.com/beiyoufx/soraka</a>
            </div>
            <div>
              Github：<a href="https://gitee.com/beiyoufx/soraka" target="_blank">https://gitee.com/beiyoufx/soraka</a>
            </div>
          </el-collapse-item>
          <el-collapse-item title="关注我们" name="1">
            <div>公众号 <b>Java实践笔记</b></div>
            <div>分享Java开发中常用的技术，分享软件开发的新技术，分享业内相关的解决方案和互联网资讯，让自己做一个紧跟时代潮流的程序猿~</div>
            <img src="/javanoteqr.jpg" class="qrcode">
          </el-collapse-item>
        </el-collapse>
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      activeNames: ['1', '2']
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.banner-text {
  position: relative;
  padding: 0 20px;
  font-size: 20px;
  text-align: center;
  color: #333;
}
.qrcode {
  width: 200px;
  height: 200px;
}
</style>
