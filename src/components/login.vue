<template>
    <div style="height: 100%">
      <el-container style="height: 100%;">
        <el-header height="150px">

        </el-header>
        <el-main>
          <div class="login">
            <h2>欢迎登录</h2>
            <el-divider></el-divider>
            <div class="input-h">
              <el-input  prefix-icon="el-icon-user-solid" v-model="name"></el-input>
            </div>
            <div class="input-h" >
              <el-input  prefix-icon="el-icon-lock" v-model="password" type="password"></el-input>
            </div>
            <div class="input-h">
              <el-button type="primary" style="width: 400px" plain @click="login">登录</el-button>
            </div>
          </div>
        </el-main>
        <el-footer height="200px"></el-footer>
      </el-container>
    </div>
</template>

<script>
  export default {
    name: 'login',
    data(){
      return{
        name:'',
        password:''
      }
    },
    methods:{
      login(){
        let msg={
          name:this.name,
          password: this.password
        }
        const loading=this.$loading();
        this.$http.post('/api/login',msg).then(v=>{
          loading.close();
          let data=v.data;
          if(data.code){
            this.$message.error(data.msg)
          }else {
            sessionStorage.setItem('token',data.data);
            this.$router.push('/shopList')
          }
        })
      }
    },
    created () {
      let token =sessionStorage.getItem('token');
      if (token){
        this.$router.push('/shopList');
      }
    }
  }
</script>

<style scoped>
  .el-header, .el-footer {
    color: #333;
    text-align: center;
  }

  .el-aside {
    color: #333;
    text-align: center;
  }

  .el-main {
    /*background-color: rgb(255,208,228);*/
    background-image: linear-gradient(to bottom right, #eabcac, #e35e69);
    color: #333;
    text-align: center;
  }


  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {

  }

  .el-container:nth-child(7) .el-aside {

  }
  .login{
    width: 400px;
    height: 340px;
    background: #fff;
    float: right;
    margin-right: 200px;
    margin-top: 40px;
    padding:20px 20px;
  }
  .input-h{
    line-height: 50px;
    height: 50px;
    margin-bottom: 10px;
  }
</style>
