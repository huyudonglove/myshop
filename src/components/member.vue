<template>
    <div>
      会员
      <el-table :data="tableData" style="width: 80%">
        <el-table-column prop="id" label="ID" width="180">
        </el-table-column>
        <el-table-column prop="type" label="会员编号" width="180">
        </el-table-column>
        <el-table-column prop="nownum" label="名称">
        </el-table-column>
        <el-table-column prop="totalnum" label="联系方式">
        </el-table-column>
        <el-table-column prop="remainingpice" label="购买金额">
        </el-table-column>
        <el-table-column prop="image" label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" alt="" width="50" height="50">
          </template>
        </el-table-column>
        <el-table-column prop="totalpice" label="总价">
        </el-table-column>
        <el-table-column prop="buytime" label="消费记录">
          <template slot-scope="scope">
            {{new Date(parseInt(scope.row.buytime)).toLocaleString().replace(/:\d{1,2}$/,' ')}}
          </template>
        </el-table-column>

      </el-table>
    </div>
</template>

<script>
  export default {
    name: 'member',
    data(){
      return{
        tableData:[]
      }
    }
  }
</script>

<style scoped>

</style>
