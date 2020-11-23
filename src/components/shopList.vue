<template>
    <div>
      <div>
        销售单
      </div>
      <div>
        不可编辑，只可以删除
      </div>
      <div>
        <el-button @click="visible=true">创建</el-button>
      </div>
      <el-table :data="tableData" style="width: 80%">
        <el-table-column prop="id" label="ID" width="180">
        </el-table-column>
        <el-table-column prop="type" label="型号" width="180">
        </el-table-column>
        <el-table-column prop="sellnumber" label="销售数量">
        </el-table-column>
        <el-table-column prop="sellpice" label="金额">
        </el-table-column>
        <el-table-column prop="iamge" label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" alt="" width="80" height="80">
          </template>
        </el-table-column>
        <el-table-column prop="selltime" label="销售时间">
          <template slot-scope="scope">
            {{new Date(parseInt(scope.row.selltime)).toLocaleString().replace(/:\d{1,2}$/,' ')}}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button @click="deletesell(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="提示" :visible.sync="visible" width="30%" >
        <div>选择型号
          <el-autocomplete class="inline-input" v-model="state" :fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false"
                           value-key="type"  @select="handleSelect" >
            <template slot-scope="{ item }">
              <div class="name">{{ item.type}}</div>
            </template>
          </el-autocomplete>
        </div>
        <div>
          销售件数
          <el-input-number v-model="num"  :min="1" :max="100" label="描述文字"></el-input-number>
        </div>

        <div>销售金额
          <el-input v-model="pice" style="width: 200px"></el-input>
        </div>
        <div>销售时间
          <el-date-picker v-model="time" type="datetime" placeholder="选择日期时间" value-format="timestamp">
          </el-date-picker>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="createShop()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'shopList',
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
        pice:''
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
      handleSelect(item) {
        console.log(item);
        this.buyId=item.id;
      },
      getBuy(){
        this.$http.get('/api/getBuy').then(v=>{
          console.log(v);
          const data=v.data.data;
          this.all=data;
        })
      },
      createShop(){
        console.log(this.state);
        let msg={
          buyId:this.buyId,
          num:this.num,
          pice:this.pice,
          time:this.time,
          type:this.state
        };
        console.log(msg);
        this.$http.post('/api/createShop',msg).then(v=>{

        })
      },
      getShop(){
        this.$http.get('/api/getShop').then(v=>{
          this.tableData=[];
          v.data.data.map(r=>{
            r.imageUrl=`/api/public/${r.image}`;
            this.tableData.push(r)
          })
        })
      },
      deletesell(id){
        let msg={
          id:id
        }
        this.$http.post('/api/deletesell',msg).then(v=>{

        })
      }
    },
    created () {
      this.getBuy();
      this.getShop();
    }
  }
</script>

<style scoped>

</style>
