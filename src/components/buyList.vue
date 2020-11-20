<template>
    <div>
      <div>进货单</div>
      <div>
        <el-button @click="show()">创建</el-button>
      </div>
      <el-table :data="tableData" style="width: 80%">
        <el-table-column prop="id" label="ID" width="180">
        </el-table-column>
        <el-table-column prop="type" label="型号" width="180">
        </el-table-column>
        <el-table-column prop="buypice" label="单价">
        </el-table-column>
        <el-table-column prop="image" label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.imageUrl" alt="" width="50" height="50">
            </template>
        </el-table-column>
        <el-table-column prop="number" label="总数">
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
            <el-button @click="deleteBuy(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-dialog title="提示" :visible.sync="visible" width="30%" >
          <span>
            型号<el-input v-model="type"></el-input>
          </span>
          <span>
            数量<el-input v-model="number"></el-input>
          </span>
          <span>
            单价<el-input v-model="buypice"></el-input>
          </span>
          <span>
            总价<el-input v-model="totalpice" :disabled="true"></el-input>
          </span>
          <span>
            时间
           <el-date-picker v-model="buytime" type="datetime" placeholder="选择日期时间" @change="change" value-format="timestamp">
            </el-date-picker>
          </span>
          <br>
          <span>
            图片
            <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false" :on-success="handleAvatarSuccess" >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          </span>

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
        buytime: ''
      }
    },
    computed:{
      totalpice(){
        return this.number*this.buypice
      }
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
        console.log(msg);
        this.$http.post('/api/createbuy',msg).then(v=>{
          console.log(v,777);
          this.getBuy()
        })
      },
      getBuy(){
        this.tableData=[];
        this.$http.get('/api/getBuy').then(v=>{
          console.log(v,777);
          v.data.data.map(r=> {
            //console.log(rTime(r.buytime))
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
        this.$http.post('/api/updateBuy',msg).then(res=>{
          this.visible=false;
          this.getBuy();
        })
      },
      deleteBuy(id){
        let msg={
          id:id
        }
        this.$http.post(`/api/deleteBuy`,msg).then(res=>{
          this.getBuy();
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
</style>
