<template>
    <div>
      <div>
        <el-button @click="visible=true" type="primary" style="margin-top: 10px">创建</el-button>
      </div>
      <div class="support">
        销售单不可编辑，如发生退换货，请将原有的销售记录删除
      </div>
      <div class="support">
        销售单数据自动同步库存单数据
      </div>

      <el-table :data="tableData" style="width: 80%" border stripe  row-key="id"  ref="table" :max-height="tableHeight">
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
            <img :src="scope.row.imageUrl" alt="" width="80" height="80" align="center">
          </template>
        </el-table-column>
        <el-table-column prop="selltime" label="销售时间" align="center" width="180">
          <template slot-scope="scope">
            {{new Date(parseInt(scope.row.selltime)).toLocaleString().replace(/:\d{1,2}$/,' ')}}
          </template>
        </el-table-column>
        <el-table-column prop="memberName" label="会员" align="center">
        </el-table-column>
        <el-table-column prop="sellRole" label="销售人员" align="center">
          <template slot-scope="scope">
            <p v-for="item in scope.row.sell">
              {{item.name}}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="deletesell(scope.row.id)" type="warning">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <pagination :total="totalPage"></pagination>
      </div>
      <el-dialog title="销售单" :visible.sync="visible" width="25%">
        <div >
          <div class="h-div">
            <i style="color: #e4393c;padding: 0 5px">*</i>
            选择型号
            <span class="support" style="color: #C0C4CC">(型号同步进货单)</span>
          </div>
          <el-autocomplete class="inline-input" v-model="state" :fetch-suggestions="querySearch" placeholder="请选择型号，可进行关键字搜索，必须选择，不可直接输入"
                           value-key="type"  @select="handleSelect" style="width: 400px">
            <template slot-scope="{ item }">
              <div class="name">{{ item.type}}</div>
            </template>
          </el-autocomplete>
        </div>
        <div>
          <div class="h-div"><i style="color: #e4393c;padding: 0 5px">*</i>销售件数</div>
          <el-input-number v-model="num"  :min="1" :max="100" label="描述文字"></el-input-number>
        </div>

        <div>
          <div class="h-div"><i style="color: #e4393c;padding: 0 5px">*</i>销售金额</div>
          <el-input v-model="pice" style="width: 400px" placeholder="请输入金额" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" ></el-input>
        </div>
        <div>
          <div class="h-div"><i style="color: #e4393c;padding: 0 5px">*</i>销售时间</div>
          <el-date-picker v-model="time" type="datetime" placeholder="选择日期时间" value-format="timestamp" style="width: 400px">
          </el-date-picker>
        </div>
        <div>
          <div class="h-div">会员</div>
          <el-autocomplete popper-class="my-autocomplete" v-model="memberState" :fetch-suggestions="querySearchMember" placeholder="请选择会员"
                           value-key="memberPhone"  @select="handleSelectMember" style="width: 400px">
            <template slot-scope="{ item }">
              <div class="name">{{ item.memberPhone}}</div>
              <span class="addr">{{ item.memberName }}</span>
            </template>
          </el-autocomplete>
        </div>
        <div>
          <div class="h-div">
            销售人员
            <span class="support" style="color: #C0C4CC">(被禁用的人员不会显示)</span>
          </div>
          <el-checkbox v-for="sell in allSell" :label="sell.account" :key="sell.account" v-model="sell.checked">{{sell.name}}</el-checkbox>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false;clear();">取 消</el-button>
          <el-button type="primary" @click="createShop()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import pagination from '../share/pagination'
  export default {
    name: 'shopList',
    components:{
      pagination
    },
    data(){
      return{
        tableData:[],
        visible:false,
        type:'',
        all:[],
        state:'',
        buyId:'',
        num:1,
        time:'',
        pice:'',
        allMember:[],
        memberState:'',
        sellRole:[],
        allSell:[],
        memberName:'',
        memberPhone:'',
        totalPage:0,
        tableHeight:0
      }
    },
    methods:{
      querySearch(queryString, cb) {
        var res = this.all;
        var results = queryString ? res.filter(v=>{
          return v.type.toLowerCase().includes(queryString.toLowerCase())
        }) : res;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      querySearchMember(queryString, cb) {
        var res = this.allMember;
        var results = queryString ? res.filter(v=>{
          return v.memberPhone.toLowerCase().includes(queryString.toLowerCase())
        }) : res;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      handleSelect(item) {
        this.buyId=item.id;
        this.type=item.type;
      },
      getBuy(){
        this.$http.get('/api/getBuy').then(v=>{
          console.log(v);
          const data=v.data.data;
          this.all=data;
        })
      },
      createShop(){
        if(!this.buyId){
          this.$message.error('型号不能为空');
          return;
        }
        if(!this.pice){
          this.$message.error('销售金额不能为空');
          return;
        }
        if(!this.time){
          this.$message.error('销售时间不能为空');
          return;
        }
        this.sellRole=[];
        this.allSell.map(v=>{
          if(v.checked) this.sellRole.push(v)
        })
        console.log(this.sellRole,999)
        let msg={
          buyId:this.buyId,
          num:this.num,
          pice:this.pice,
          time:this.time,
          type:this.state,
          sellRole:this.sellRole,
          member:this.memberState,
          memberName: this.memberName,
          memberPhone: this.memberPhone
        };
        console.log(msg);
        const loading=this.$loading();
        this.$http.post('/api/createShop',msg).then(v=>{
          loading.close();
          if(v.data.code){
            this.$message.error(v.data.msg)
          }else {
            this.$message.success(v.data.msg);
            this.visible=false;
            this.clear();
            this.getShop();
          }
        }).catch(r=>{
          this.$message.error(v.message);
           this.getShop();
        })
      },
      getShop(){
        let msg={
          page:this.$route.query.page||1,
          limit:this.$route.query.limit||20
        }
        this.$http.post('/api/postShop',msg).then(v=>{
          this.tableData=[];
          this.totalPage=v.data.totalPage;
          v.data.data.map(r=>{
            r.imageUrl=`/api/public/${r.image}`;
            r.sell=JSON.parse(r.sellRole)
            this.tableData.push(r);
          })

        })
      },
      deletesell(id){
        this.$confirm('确定删除销售单吗?','提示').then(v=>{
          let msg={
            id:id
          }
          const loading=this.$loading();
          this.$http.post('/api/deletesell',msg).then(v=>{
            loading.close();
            this.$message.success(v.data.msg)
            this.getShop();
          })
        }).catch(r=>{
          return;
        })

      },
      getMember(){
        this.$http.get('/api/getMember').then(v=>{
            this.allMember=v.data.data;
        })
      },
      getSell(){
        this.$http.get('/api/getLoginName?type=0').then(v=>{
          v.data.data.map(r=>{
            r.checked=false;
            this.allSell.push(r);
          })
        })
      },
      handleSelectMember(item){
        console.log(item);
        this.memberName=item.memberName;
        this.memberPhone=item.memberPhone;
      },
      sellChange(item){
        console.log(item)
      },
      clear(){
        this.buyId='';
        this.state='';
        this.memberState='';
        this.num=1;
        this.pice='';
        this.time='';
        this.allSell.map(v=>{
          v.checked=false;
        });
        this.memberName='';
        this.memberPhone='';
      },
    },
    created () {
      this.getBuy();
      this.getShop();
      this.getMember();
      this.getSell();
    },
    updated(){
      if(this.$route.name=='shopList'){
        this.$nextTick(()=>{
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 110;
        })
      }
    },
    watch:{
      $route(){
        this.getShop();
      }
    }
  }
</script>

<style >
  .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .addr {
    font-size: 12px;
    color: #b4b4b4;
  }
  .headerCellStyle{
    background: #e35e69 !important;
  }
  .h-div{
    padding: 10px 0;
  }
  .el-dialog__body{
    padding-top: 5px;
  }
</style>
