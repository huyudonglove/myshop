<template>
    <div>
      <div>
        <el-button @click="visible=true" type="primary" style="margin-top: 10px">创建</el-button>
      </div>
      <div class="support">
        会员信息只可编辑，不可删除
      </div>
      <el-table :data="tableData" style="width: 80%" ref="table" :max-height="tableHeight" border stripe>
        <el-table-column prop="id" label="ID" width="180">
        </el-table-column>
        <el-table-column prop="memberName" label="会员名称">
          <template slot-scope="scope">
            <span style="color: #b4763e">{{scope.row.memberName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="memberPhone" label="联系方式">
        </el-table-column>
        <el-table-column prop="buytime" label="消费记录">
          <template slot-scope="scope" >
            <el-button @click="getMemberBuy(scope.row.memberPhone)" type="primary" plain>查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <pagination :total="totalPage"></pagination>
      </div>
      <el-drawer title="消费记录" :visible.sync="drawer" :direction="direction" size="60%">
        <el-table :data="tableDataMember" style="width: 80%;margin-left: 50px" border stripe  row-key="id" >
          <el-table-column prop="id" label="订单ID" width="100" align="center">
          </el-table-column>
          <el-table-column prop="type" label="型号" width="180" align="center">
          </el-table-column>
          <el-table-column prop="sellnumber" label="销售数量" align="center">
          </el-table-column>
          <el-table-column prop="sellpice" label="金额" align="center">
          </el-table-column>
          <el-table-column prop="iamge" label="图片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.imageUrl" alt="" width="80" height="80" align="center" v-focus>
            </template>
          </el-table-column>
          <el-table-column prop="selltime" label="销售时间" align="center" width="180">
            <template slot-scope="scope">
              {{new Date(parseInt(scope.row.selltime)).toLocaleString().replace(/:\d{1,2}$/,' ')}}
            </template>
          </el-table-column>
          <el-table-column prop="memberName" label="会员" align="center">
            <template slot-scope="scope">
              <span style="color: #b4763e">{{scope.row.memberName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sellRole" label="销售人员" align="center">
            <template slot-scope="scope">
              <p v-for="item in scope.row.sell">
                {{item.name}}
              </p>
            </template>
          </el-table-column>
        </el-table>
      </el-drawer>
      <div>
        <el-dialog title="创建会员" :visible.sync="visible" width="30%">
          <div>
            <div>
              <div class="h-div"><i style="color: #e4393c;padding: 0 5px">*</i>会员名称</div>
              <el-input v-model="memberName"></el-input>
            </div>
            <div>
              <div class="h-div"><i style="color: #e4393c;padding: 0 5px">*</i>联系方式</div>
              <el-input v-model="memberPhone"></el-input>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="createMe()">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import pagination from '../share/pagination'
  export default {
    name: 'member',
    data(){
      return{
        tableData:[],
        visible:false,
        memberName:'',
        memberPhone:'',
        totalPage:0,
        drawer: false,
        direction: 'rtl',
        tableDataMember:[],
        tableHeight:0
      }
    },
    components:{
      pagination
    },
    methods:{
      createMe(){
        let msg={
          memberName: this.memberName,
          memberPhone: this.memberPhone
        };
        if(!this.memberPhone){
          this.$message.error('联系方式不能为空!');
          return
        }
        if(!this.memberName){
          this.$message.error('会员名称不能为空!')
          return
        }
        const loading=this.$loading();
        this.$http.post('/api/createMember',msg).then(v=>{
          loading.close();
          v.data.code&&this.$message.error(v.data.msg);
          !v.data.code&&(()=>{
            this.getMe();
            this.visible=false;
            this.$message.success(v.data.msg);
            this.clear();
          })();
        })
      },
      getMe(){
        let msg={
          page:this.$route.query.page||1,
          limit:this.$route.query.limit||20
        }
        this.$http.post('/api/postMember',msg).then(v=>{
          this.tableData=v.data.data;
          this.totalPage=v.data.totalPage;
        })
      },
      clear(){
        this.memberName='';
        this.memberPhone='';
      },
      getMemberBuy(phnoe){
        this.tableDataMember=[];
        this.$http.get(`/api/getMemberBuy?memberPhone=${phnoe}`).then(
          res=>{
            this.drawer=true;
            res.data.data.map(v=>{
              v.imageUrl=`/api/public/${v.image}`;
              v.sell=JSON.parse(v.sellRole)
              this.tableDataMember.push(v);
            })

          }
        )
      }
    },
    updated(){
      if(this.$route.name=='member'){
        this.$nextTick(()=>{
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 110;
        })
      }
    },
    created () {
      this.getMe()
    }
  }
</script>

<style scoped>
  .h-div{
    padding: 10px 0;
  }
  .el-dialog__body{
    padding-top: 5px;
  }
</style>
