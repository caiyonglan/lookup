<template>
  <div class="search">
    <Row type="flex" justify="center">
      <Col span="12" class="content" :xs="18" :sm="18" :md="18" :lg="16">
        <Input @on-enter="searchQuestion()" v-model="data" autofocus @click.native="searchQuestion()" size="large" search enter-button placeholder="Enter something..."></Input>
        <br><br>
        <List item-layout="vertical">
          <ListItem style="margin-top: 20px">
            <ListItem v-for="que in questions" :key="que.id" style="font-size: 16px;padding: 5px;border: none;">
              <Card>
                <div>
                  <Row type="flex" justify="center" style="text-align: center">
                    <Col span="8">
                      <Icon type="md-umbrella" color="#ff9900" size="24" />
                      <span>{{ que.id }}</span><br>
                    </Col>
                    <Col span="8">
                      <Icon type="md-pricetag" color="#2db7f5" size="24" />
                      <span>{{ que.classname }}</span><br>
                    </Col>
                    <Col span="8">
                      <Icon type="logo-freebsd-devil" color="#2d8cf0" size="24" />
                      <span>{{ que.author }}</span><br>
                    </Col>
                  </Row>
                  <Divider/>
                  <Row style="text-align: left;padding-left: 5%;">
                    <Col>
                      <Icon type="md-help" color="#ed4014" size="24" style="margin-right: 1%" />
                      <span> {{ que.name }}</span><br>
                    </Col>
                    <br>
                    <Col>
                      <Icon type="ios-heart" color="#19be6b" size="24" style="margin-right: 1%" />
                      <span> {{ que.answer }}</span><br>
                    </Col>
                  </Row>

                </div>
              </Card>

            </ListItem>
          </ListItem>
        </List>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      questions: [],
      data: ''
    }
  },
  methods: {
    searchQuestion () {
      this.data = this.data.trim()
      if (typeof this.data !== 'undefined' && this.data.length !== 0) {
        this.axios.post('/search', { name: this.data })
          .then(response => {
            this.data = ''
            if (response.data.code === '1') {
              this.$Message.error('一大波内容正在快马加鞭的赶来...')
            } else {
              this.questions = response.data.data
              this.$Message.success(response.data.msg + ' !')
            }
          }).catch(error => {
            this.$Message.error('查询失败 !')
            console.log(error)
          })
      } else {
        this.$Message.error('输入不能为空 !')
      }
    }
  }
}
</script>

<style scoped>

</style>
