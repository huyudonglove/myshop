<template>
  <div >
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" >
      <el-menu-item index="1">销售单</el-menu-item>
      <el-menu-item index="2">进货单</el-menu-item>
      <el-menu-item index="3">库存单</el-menu-item>
      <el-menu-item index="4">会员中心</el-menu-item>
      <el-menu-item index="5">账号管理</el-menu-item>
    </el-menu>
    <span class="quit">
      <el-button type="primary" icon="el-icon-switch-button" size="medium" @click="checkOut">退出</el-button>
    </span>
    <router-view style="padding-left: 20px;"></router-view>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      activeIndex: '1'
    }
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
          this.$router.push('/member');
          break;
        case '5':
          this.$router.push('/role');
          break;
        default:
          break;
      }
    },
    judgeR(){
      const name=this.$route.name;
      switch (name) {
        case 'shopList':
          this.activeIndex='1';
          break;
        case 'buyList':
          this.activeIndex='2';
          break;
        case 'stockList':
          this.activeIndex='3';
          break;
        case 'member':
          this.activeIndex='4';
          break;
        case 'role':
          this.activeIndex='5';
          break;
        default:
          break;
      }
    },
    checkOut(){
      this.$confirm('确认退出吗').then(v=>{
        this.$router.push('/logout')
      }).catch(r=>{
        return;
      })
    }
  },
  created () {
    this.judgeR()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.quit{
  position: absolute;
  left: 1800px;
  top: 10px;
}
</style>
