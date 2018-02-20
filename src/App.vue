<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style type="text/css" lang="scss">
  @import './style/reset.css';
  @import './style/iconfont.css';
  @import './style/element.scss';
  #app {
    height: 100%;
  }
</style>
