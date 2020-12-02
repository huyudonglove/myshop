<template>
    <div>
      <div>
        <el-button @click="show()" type="primary" style="margin-top: 10px">创建</el-button>
      </div>
      <div class="support">
        在未产生销售单前进货单可编辑和删除
      </div>
      <div class="support">
        进货单自动同步库存单
      </div>
      <el-table :data="tableData" style="width: 80%" border ref="table" :max-height="tableHeight" stripe>
        <el-table-column prop="id" label="ID" width="180">
        </el-table-column>
        <el-table-column prop="type" label="型号" width="180">
        </el-table-column>
        <el-table-column prop="buypice" label="单价">
        </el-table-column>
        <el-table-column prop="image" label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.imageUrl" alt="" width="50" height="50" v-focus>
            </template>
        </el-table-column>
        <el-table-column prop="number" label="数量">
        </el-table-column>
        <el-table-column prop="totalpice" label="总价">
        </el-table-column>
        <el-table-column prop="buytime" label="购买时间">
          <template slot-scope="scope">
            {{new Date(parseInt(scope.row.buytime)).toLocaleString().replace(/:\d{1,2}$/,' ')}}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button @click="buyMsg(scope.row.id)">编辑</el-button>
            <el-button @click="deleteBuy(scope.row.id)" type="warning">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <pagination :total="totalPage"></pagination>
      </div>
      <div>
        <el-dialog title="进货单" :visible.sync="visible" width="28%" >
          <div>
            <div class="h-div"><i style="color: #e4393c;padding: 0 5px">*</i>型号</div>
            <el-input v-model="type" placeholder="建议输入型号+日期，例如 女装0203，避免重名"></el-input>
          </div>
          <div>
            <div class="h-div"><i style="color: #e4393c;padding: 0 5px">*</i>数量</div>
            <el-input v-model="number" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
          </div>
          <div>
            <div class="h-div">
              单价
            </div>
            <el-input v-model="buypice" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
          </div>
          <div>
            <div class="h-div"><i style="color: #e4393c;padding: 0 5px">*</i>总价</div>
            <el-input v-model="totalpice" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
          </div>
          <div>
            <div class="h-div">
              时间
            </div>
           <el-date-picker v-model="buytime" type="datetime" placeholder="选择日期时间" @change="change" value-format="timestamp">
            </el-date-picker>
          </div>
          <br>
          <div>
            <div class="h-div">
              图片
            </div>
            <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false" :on-success="handleAvatarSuccess" accept="image/png, image/jpeg" :headers="header">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          </div>

          <span slot="footer" class="dialog-footer">
            <el-button @click="show()">取 消</el-button>
            <el-button type="primary" @click="addBuy()" v-if="!id">确 定</el-button>
            <el-button type="primary" @click="updateBuy()" v-if="id">修改</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import pagination from '../share/pagination'
  export default {
    name: 'buyList',
    data(){
      return{
        tableData:[],
        visible:false,
        type:'',
        number:0,
        buypice:0,
        image:'',
        id:'',
        imageUrl:'',
        buytime: '',
        totalpice:0,
        totalPage:0,
        tableHeight:0,
        header:{
          Authorization:sessionStorage.getItem('token')
        }
      }
    },
    components:{
      pagination
    },
    methods:{
      show(){
        this.id='';
        this.visible=!this.visible;
      },
      addBuy(){
        let msg={
          type:this.type,
          number:this.number,
          buypice: this.buypice,
          totalpice:this.totalpice,
          image:this.image,
          buytime:this.buytime
        }
        if(!msg.type){
          this.$message.error('型号不能为空!')
          return
        }
        if(!msg.number){
          this.$message.error('数量不能为空!')
          return
        }
        if(!msg.totalpice){
          this.$message.error('总价不能为空!')
          return
        }
        const loading=this.$loading();
        this.$http.post('/api/createbuy',msg).then(v=>{
          loading.close();
          if(v.data.code){
            this.$message.error(v.data.msg)
          }else {
            this.$message.success(v.data.msg);
            this.visible=false;
            this.getBuy()
          }

        })
      },
      getBuy(){
        this.tableData=[];
        let msg={
          page:this.$route.query.page||1,
          limit:this.$route.query.limit||20
        }
        this.$http.post('/api/postBuy',msg).then(v=>{
          this.totalPage=v.data.totalPage;
          v.data.data.map(r=> {
            r.imageUrl=`/api/public/${r.image}`
            this.tableData.push(r)
            }
          );
          console.log(typeof v.data,999)
        })
      },
      buyMsg(id){
        this.$http.get(`/api/buyMsg?id=${id}`).then(res=>{
          //debugger;
          let data=res.data;
          data.code?(()=>{
            this.$message.error(data.msg)
          })():(()=>{
            this.visible=true;
            console.log(data);
            this.id=data.data.id;
            this.buypice=data.data.buypice;
            this.image=data.data.image;
            this.imageUrl=`/api/public/${data.data.image}`
            this.number=data.data.number;
            this.type=data.data.type;
            this.buytime=data.data.buytime;
            this.totalpice=data.data.totalpice;
          })();
        })
      },
      updateBuy(){
        let msg={
          id:this.id,
          type:this.type,
          number:this.number,
          buypice: this.buypice,
          totalpice:this.totalpice,
          image:this.image
        }
        const loading=this.$loading();
        this.$http.post('/api/updateBuy',msg).then(res=>{
          loading.close();
          this.visible=false;
          this.getBuy();
        })
      },
      deleteBuy(id){
        this.$confirm('确定删除吗').then(v=>{
          let msg={
            id:id
          }
          const loading=this.$loading();
          this.$http.post(`/api/deleteBuy`,msg).then(res=>{
            loading.close();
            if(res.data.code){
              this.$message.error(res.data.msg)
            }
            this.getBuy();
          })
        }).catch(r=>{
          return
        })

      },
      handleAvatarSuccess(res, file) {
        console.log(res,7777)
        this.imageUrl = URL.createObjectURL(file.raw);
        this.image=res.data.filename;
      },
      change(){
        console.log(this.buytime)
      }
    },
    mounted () {
      this.getBuy();
    },
    updated(){
      if(this.$route.name=='buyList'){
        this.$nextTick(()=>{
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 110;
        })
      }
    },
    watch:{
      $route(){
        this.getBuy();
      }
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .h-div{
    padding: 10px 0;
  }
  .el-dialog__body{
    padding-top: 5px;
  }
</style>
