<template>
    <div  style="position:fixed;left:10px;bottom:10px;">
      <el-pagination @size-change="limitChange" @current-change="pageChange"
                     :current-page="parseInt(page)"
                     :page-sizes="[20, 40, 60, 80]"
                     :page-size="parseInt(limit)"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="parseInt(total)">
      </el-pagination>
    </div>
</template>

<script>
  export default {
    name: 'pagination',
    data(){
      return{
        page:1,
        limit:20,
      }
    },
    inject:['replace'],
    props:['total'],
    methods:{
      limitChange(val){
        this.replace('limit',val)
      },
      pageChange(val){
        this.replace('page',val)
      }
    },
    created () {
      this.page=this.$route.query.page||1;
      this.limit=this.$route.query.limit||20;
    },
    watch:{
      $route(){
        this.page=this.$route.query.page||1;
        this.limit=this.$route.query.limit||20;
      }
    }

  }
</script>

<style scoped>

</style>
