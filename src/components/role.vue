<template>
    <div>
      <div>
        <el-button @click="visible=true" type="primary" style="margin-top: 10px">创建</el-button>
      </div>
      <div class="support">
        账号可以禁用，不可删除,不可编辑
      </div>
      <div>
        <el-table :data="tableData" style="width: 80%" border>
          <el-table-column prop="name" label="用户名" width="400">
          </el-table-column>
          <el-table-column prop="account" label="账号" width="800">
          </el-table-column>
          <el-table-column prop="address" label="禁用/启用">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.type" :active-value="0" :inactive-value="1" @change="updateRole(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog title="创建用户" :visible.sync="visible" width="30%">
        <div>
          <div class="h-div"><i style="color: #e4393c;padding: 0 5px">*</i>用户名</div>
          <el-input v-model="name"></el-input>
        </div>
        <div>
          <div class="h-div"><i style="color: #e4393c;padding: 0 5px">*</i>账号</div>
          <el-input v-model="account" placeholder="账号用来登录"></el-input>
        </div>
        <div>
          <div class="h-div"><i style="color: #e4393c;padding: 0 5px">*</i>用户密码</div>
          <el-input v-model="password"></el-input>
        </div>
        <div>
          <div class="h-div"><i style="color: #e4393c;padding: 0 5px">*</i>再次确认密码</div>
          <el-input v-model="confirmPass" ></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="createRole">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'role',
    data(){
      return{
        tableData:[],
        value:true,
        visible:false,
        name:'',
        password:'',
        confirmPass:'',
        account:''
      }
    },
    methods:{
      createRole(){
        let msg={
          name:this.name,
          account:this.account,
          password: this.password
        }
        if(!this.name){
          this.$message.error('用户名不能为空！')
          return
        }
        if(!this.account){
          this.$message.error('账号不能为空！')
          return
        }
        if(!this.password){
          this.$message.error('密码不能为空！')
          return
        }
        if(this.password!=this.password){
          this.$message.error('两次密码不相同')
          return
        }
        const loading=this.$loading();
        this.$http.post('/api/createLoginName',msg).then(v=>{
            loading.close();
            v.data.code&&this.$message.error(res.data.msg);
            !v.data.code&&(()=>{
                this.$message.success(v.data.msg);
                this.visible=false;
                this.clear();
            })();
        })
      },
      getRole(){
        this.$http.get('/api/getLoginName').then(v=>{
          this.tableData=v.data.data;
        })
      },
      updateRole(account){
        console.log(account,777);
        let msg=account.type==1?'确定禁用该账户吗？':'确定启用该账户吗？';
        this.$confirm(msg,'提示').then(()=>{
          let msg={
            account:account.account,
            type:account.type
          }
          const loading=this.$loading();
          this.$http.post('/api/updateRole',msg).then(v=>{
            loading.close();
            this.getRole();
          })
        }).catch(()=>{
          account.type==1?account.type=0:account.type=1;
        })

      },
      clear(){
        this.name='';
        this.account='';
        this.password='';
        this.confirmPass='';
      }
    },
    created () {
      this.getRole();
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
