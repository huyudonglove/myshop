<template>
    <div></div>
</template>

<script>
  export default {
    name: 'logout',
    methods:{
      logoutM(){
        sessionStorage.removeItem('token');
        this.$router.push('/login');
      }
    },
    created () {
      this.logoutM();
    }
  }
</script>

<style scoped>

</style>
