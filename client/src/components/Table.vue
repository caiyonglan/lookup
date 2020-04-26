<template>
  <Row type="flex" justify="center">
    <Col span="12" class="content" :xs="18" :sm="18" :md="18" :lg="16">
      <Divider/>
      <Table border :columns="columns" :data="data">
        <template slot-scope="{ row }" slot="id">
          <strong>{{ row.id }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button :ghost="true" type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>
          <Button :ghost="true" type="error" size="small" @click="remove(row.id, index)">Delete</Button>
        </template>
      </Table>
      <br><br>
      <Page simple  :total="totals" :page-size="pageSize" :current="pageIndex" @on-change="changePage"/>
    </Col>
  </Row>

</template>
<script>

export default {
  data () {
    return {
      pageIndex: 1,
      pageSize: 5,
      columns: [
        {
          title: 'Id',
          slot: 'id'
        },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Answer',
          key: 'answer'
        },
        {
          title: 'Classname',
          key: 'classname'
        },
        {
          title: 'Author',
          key: 'author'
        },
        {
          title: 'Action',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      data: [],
      totals: 0
    }
  },
  methods: {
    show (index) {
      this.$Modal.info({
        title: 'Information',
        content: `Id：${this.data[index].id}<br>Name：${this.data[index].name}<br>Answer：${this.data[index].answer}<br>Classname：${this.data[index].classname}<br>Author：${this.data[index].author}`
      })
    },
    remove (id, index) {
      this.data.splice(index, 1)
      this.axios.post('/list/deleteById', { id: id })
        .then(response => {
          this.$Message.success(response.data.msg + ' !')
          const timer = setInterval(this.loadData(this.pageIndex), 500)
          clearInterval(timer)
        }).catch(error => {
          this.$Message.error('删除失败 !')
          console.log(error)
        })
    },
    loadData (index) {
      this.axios.post('/list/queryAll', { index: this.pageIndex })
        .then(response => {
          if (response.data.code !== '405') {
            this.data = response.data.data.questions
            this.pageIndex = response.data.data.index
            this.totals = response.data.data.total
          } else {
            this.$router.push('/login')
          }
        }).catch(error => console.log(error))
    },
    changePage (index) {
      this.pageIndex = index
      this.loadData(index)
    }
  },
  mounted () {
    this.loadData(this.pageIndex)
  },
  watch: {
    listenToPageIndex () {
      console.log(this.pageIndex)
    }
  }
}
</script>
