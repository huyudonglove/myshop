<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {

    };
  },
  provide(){
    return{
      replace:this.replace
    }
  },
  methods:{

    replace(key,val){
      //修改路由参数
      let apple=JSON.stringify(this.$route.query);
      //console.log(apple,'apple')
      let banner=JSON.parse(apple);
      if(key!='reset'){
        banner[key]=val;
      }else if (key=='reset'){
        // this.setClickPage(1);
        // this.setLimitPage(20);
        for(let i in banner){
          banner[i]=''
        }

      }
      // banner.page=this.clickPage;
      // banner.limit=this.limitPage;

      // console.log(banner)

      this.$router.push(
        {
          path:this.$route.path,
          query:banner
        }
      ).catch(err=>{
        console.log(err)
      })
    },

  }
}
</script>

<style>

</style>
