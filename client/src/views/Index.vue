<template>
  <div class="index">
    <div class="nav">
      <Button
        size="large"
        :ghost="true"
        icon="ios-paper-plane"
        style="margin-right: 5%"
        @click="checkUser()"
      >
        Admin
      </Button>
    </div>
    <Search/>
  </div>
</template>

<script>
import Search from '../components/Search'
export default {
  name: 'Index',
  components: {
    Search
  },
  data () {
    return {
      url: '/'
    }
  },
  methods: {
    checkUser () {
      this.axios.get('/checkLogin')
        .then(response => {
          console.log(response.data)
          if (response.data.code === '405') {
            this.$Message.warning('未登录，2s跳转登录页面 !')
            setTimeout(() => {
              this.$router.push('/login')
            }, 2000)
            // clearTimeout(timer, 2000)
          } else {
            this.$router.push('/list')
          }
        }).catch(error => {
          // this.$Message.error('查询失败 !')
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
  .index {
    text-align: right;
    padding-top: 5%;
  }
.nav {
  padding-bottom: 10%;
}
</style>
