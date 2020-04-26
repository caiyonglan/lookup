<template>
  <div class="login">
    <Row type="flex" justify="center">
      <Col span="24" style="margin-bottom: 1%">
        <img src="/images/favicon.png" alt="favicon.png" style="width: 10%;">
      </Col>
      <Col span="6" class="content" :xs="14" :sm="10" :md="8" :lg="6">
        <Form ref="formInline" :model="formInline" :rules="ruleInline"  style="text-align: center !important;">
          <FormItem prop="user">
            <Input type="text" v-model="formInline.user" placeholder="Username" size="large">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <br>
          <FormItem prop="password">
            <Input type="password" v-model="formInline.password" placeholder="Password" size="large">
              <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <br>
          <FormItem>
            <Button :loading="loading" type="primary" @click="handleSubmit('formInline')">Signin</Button>
          </FormItem>
        </Form>

      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      formInline: {
        user: '',
        password: ''
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: 'Please fill in the user name',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'Please fill in the password.',
            trigger: 'blur'
          }
          // {
          //   type: 'string',
          //   min: 6,
          //   message: 'The password length cannot be less than 6 bits',
          //   trigger: 'blur'
          // }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.loading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.axios.post('/users/login', { user: this.formInline.user, password: this.formInline.password })
            .then(response => {
              if (response.data.code !== '200') {
                this.$Message.error('登陆失败 !')
              } else {
                this.$Message.success(response.data.msg + ' !')
                setTimeout(() => {
                  this.loading = false
                  this.$router.push('/list')
                }, 2000)
              }
            }).catch(error => {
              this.$Message.error('查询失败 !')
              console.log(error)
            })
        } else {
          this.$Message.error('Fail!')
        }
      })
    }
  }
}
</script>

<style scoped>
.login {
  padding-top: 10%;
}
</style>
