<template>
  <div id="app">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">销售单</el-menu-item>
      <el-menu-item index="2">进货单</el-menu-item>
      <el-menu-item index="3">库存单</el-menu-item>
      <el-menu-item index="4">会员中心</el-menu-item>
    </el-menu>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    };
  },
  methods:{
    handleSelect(key, keyPath) {
      switch (key) {
        case '1':
          this.$router.push('/shopList');
          break;
        case '2':
          this.$router.push('/buyList');
          break;
        case '3':
          this.$router.push('/stockList');
          break;
        case '4':
          break;
        default:
          break;
      }
    }
  }
}
</script>

<style>

</style>
