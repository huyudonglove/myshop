<template>
    <div>
      <div class="support" style="margin-top: 10px">
        不可编辑删除，同步进货单和销售单
      </div>
      <el-table :data="tableData" style="width: 80%" border ref="table" :max-height="tableHeight" stripe>
        <el-table-column prop="id" label="ID" width="180">
        </el-table-column>
        <el-table-column prop="type" label="型号" width="180">
        </el-table-column>
        <el-table-column prop="nownum" label="现存数量">
        </el-table-column>
        <el-table-column prop="totalnum" label="总库存">
        </el-table-column>
        <el-table-column prop="remainingpice" label="销售金额">
        </el-table-column>
        <el-table-column prop="image" label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" alt="" width="50" height="50" v-focus>
          </template>
        </el-table-column>
        <el-table-column prop="totalpice" label="总价">
        </el-table-column>
        <el-table-column prop="buytime" label="购买时间">
          <template slot-scope="scope">
            {{new Date(parseInt(scope.row.buytime)).toLocaleString().replace(/:\d{1,2}$/,' ')}}
          </template>
        </el-table-column>
      </el-table>
      <div>
        <pagination :total="totalPage"></pagination>
      </div>
    </div>
</template>

<script>
  import pagination from '../share/pagination'
  export default {
    name: 'stockList',
    data(){
      return{
        tableData:[],
        totalPage:0,
        tableHeight:0
      }
    },
    components:{
      pagination
    },
    methods:{
      getStock(){
        let msg={
          page:this.$route.query.page||1,
          limit:this.$route.query.limit||20
        }
        this.$http.post('/api/postStock',msg).then(v=>{
          this.tableData=[];
          this.totalPage=v.data.totalPage;
          v.data.data.map(r=>{
            r.imageUrl=`/api/public/${r.image}`;
            this.tableData.push(r)
          })
        })
      }
    },
    updated(){
      if(this.$route.name=='stockList'){
        this.$nextTick(()=>{
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 110;
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
