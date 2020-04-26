<template>
  <div class="list">
    <router-link to='/'>
      <Button size="large" :ghost="true" type="warning" icon="md-home" style="margin-right: 5%"> Index </Button>
    </router-link>
    <Button size="large" :ghost="true" type="primary" icon="md-add-circle" @click="show()" style="margin-right: 5%"> Add New </Button>
    <Button size="large" :ghost="true" type="info" icon="md-add-circle" @click="logout()" style="margin-right: 5%"> {{loginStatus}} </Button>
    <br>
    <Drawer title="Add New" width="50%" :scrollable="true" v-model="shows">
      <Form ref="formData"  :rules="ruleInline" :model="formData">
        <Row :gutter="32">
          <Col>
            <FormItem  prop="name" label="Name" label-position="top">
              <Input :autosize="{maxRows:5,minRows: 5}" type="textarea" v-model="formData.name" />
            </FormItem>
          </Col>
          <Col>
            <FormItem  prop="answer" label="Answer" label-position="top">
              <Input :autosize="{maxRows:5,minRows: 5}" type="textarea" v-model="formData.answer">
              </Input>
            </FormItem>
          </Col>
          <Col>
            <FormItem  prop="classname" label="Classname" label-position="top">
              <Input v-model="formData.classname">
              </Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Upload
        type="drag"
        :format="['csv']"
        :before-upload="handleUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
        action="/list/upload"
        accept=".csv"
        ref="upload"
      >
        <br>
        <Tooltip content="哎呀！累死我啦，换个方式提交吧！" theme="light" placement="right" transfer>
          <Button size="large" type="success" icon="md-cloud-upload"> UpLoad </Button>
        </Tooltip>
        <br><br>
      </Upload>
      <br>
<!--      <div v-if="file !== null" style="text-align: center">-->
<!--        上传文件: {{ file.name }}-->
<!--        <Button :ghost="true" type="primary" :loading="loadingStatus">-->
<!--          {{ loadingStatus ? '上传中...' : '点击上传' }}-->
<!--        </Button>-->
<!--      </div>-->
      <div class="drawer-footer">
        <Button style="margin-right: 8px" @click="shows = false">Cancel</Button>
        <Button type="primary" @click="handleSubmit('formData')">Submit</Button>
      </div>
    </Drawer>
    <Table ref="table"/>
  </div>
</template>

<script>
import Table from '@/components/Table'

export default {
  name: 'List',
  components: {
    Table
  },
  data () {
    return {
      shows: false,
      file: null,
      loadingStatus: false,
      loginStatus: 'Logout',
      formData: {
        name: '',
        answer: '',
        classname: ''
      },
      ruleInline: {
        name: [
          { required: true, message: 'Please fill in the Name', trigger: 'blur' }
        ],
        answer: [
          { required: true, message: 'Please fill in the Answer.', trigger: 'blur' }
        ],
        classname: [
          { required: true, message: 'Please fill in the Classname', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    show () {
      this.shows = true
    },
    handleSuccess (res, file) {
      if (res.code === '200') {
        this.$refs.upload.clearFiles()
        this.$Message.success(res.msg)
        this.$refs.table.loadData(1)
        this.shows = false
      } else if (res.code === '406') {
        this.$refs.upload.clearFiles()
        this.$Message.success(res.msg)
      } else if (res.code === '405') {
        this.$refs.upload.clearFiles()
        this.$Message.success(res.msg)
      }
    },
    // eslint-disable-next-line handle-callback-err
    handleError (error, file) {
      console.log(error)
      this.$Message.error('上传失败')
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.shows = false
          this.axios.post('/list/add', this.formData)
            .then((response) => {
              this.$Message.success(response.data.msg + ' !')
              this.formData.name = ''
              this.formData.answer = ''
              this.formData.classname = ''
              const timer = setInterval(this.$refs.table.loadData(1), 1000)
              clearInterval(timer)
            })
            .catch(function (error) {
              this.$Message.success('提交失败 !')
              console.log(error)
            })
        } else {
          this.$Message.error('提交失败 !')
        }
      })
    },
    handleUpload (file) {
      this.file = file
      if (file !== null) {
        const flag = this.check()
        if (flag) {
          return true
        }
      }
      return false
    },
    check () {
      const flag = this.file.name.substr(this.file.name.lastIndexOf('.') + 1)
      if (flag !== 'csv') {
        this.$Notice.warning({
          title: '文件格式错误',
          desc: '上传文件格式不合法,请上传csv格式文件!'
        })
        return false
      }
      return true
    },
    logout () {
      this.axios.post('/users/logout')
        .then(response => {
          if (response.data.code === '200') {
            this.$Message.success(response.data.msg)
            this.$refs.table.data = []
            setTimeout(() => {
              this.$Message.info('2s跳转至首页...')
              setTimeout(() => {
                this.$router.push('/')
              }, 2000)
            }, 2000)
          } else {
            this.$Message.error(response.data.msg)
          }
        }).catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
.list {
  padding-top: 5%;
}
.drawer-footer{
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: left;
  background: #fff;
}
</style>
