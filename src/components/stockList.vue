<template>
    <div>
      <div>库存单</div>
      <el-table :data="tableData" style="width: 80%">
        <el-table-column prop="id" label="ID" width="180">
        </el-table-column>
        <el-table-column prop="type" label="型号" width="180">
        </el-table-column>
        <el-table-column prop="nownum" label="现存数量">
        </el-table-column>
        <el-table-column prop="totalnum" label="总库存">
        </el-table-column>
        <el-table-column prop="remainingpice" label="剩余金额">
        </el-table-column>
        <el-table-column prop="image" label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" alt="" width="50" height="50">
          </template>
        </el-table-column>
        <el-table-column prop="totalpice" label="总价">
        </el-table-column>
        <el-table-column prop="buytime" label="购买时间">
        </el-table-column>

      </el-table>
    </div>
</template>

<script>
  export default {
    name: 'stockList',
    data(){
      return{
        tableData:[]
      }
    },
    methods:{
      getStock(){
        this.$http.get('/api/getStock').then(v=>{
          this.tableData=[];
          v.data.data.map(r=>{
            r.imageUrl=`/api/public/${r.image}`;
            this.tableData.push(r)
          })
        })
      }
    },
    created () {
      this.getStock();
    }
  }
</script>

<style scoped>

</style>
