<template>
  <div class="login">
    <Row id="inner" type="flex" justify="center" align="middle">
      <Col span="24">
        <h1>{{ msg }}</h1>
          <Form ref="formItem" :model="formItem" :rules="ruleInline" :label-width="80">
            <Row type="flex" justify="center">
              <Col span="8">
                <Form-item label="用户名" prop="user">
                  <Input type="text" v-model="formItem.user" size="large" placeholder="Username">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                  </Input>
                </Form-item>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="8">      
                <Form-item prop="password" label="密码">
                  <Input type="password" v-model="formItem.password" size="large" placeholder="Password">
                    <Icon type="ios-locked-outline" slot="prepend"></Icon>
                  </Input>
                </Form-item>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="4">
                <Form-item>
                  <Button type="primary" @click="handleSubmit('formItem')" long>登录</Button>
                </Form-item>
              </Col>
            </Row>
          </Form>
      </Col>
    </Row>
  </div>
</template>

<script>
let role = 1;
export default {
  name: 'login',
  data () {
    return {
      msg: 'Welcome to Your Login Page',
      formItem: {
        user: '',
        password: ''
      },
      ruleInline: {
        user: [
          { message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { message: '请填写密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          localStorage.setItem('name',this.formItem.user);
          localStorage.setItem('isLogin',"0");
          this.$Message.success('提交成功!');
          this.$router.push('/home');
        } else {
          this.$Message.error('表单验证失败!');
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.login{
  height:100%;
  h1 {
    margin-bottom: 40px;
    font-weight: normal;
    text-align:center;
  }
  #inner{
    height:100%;
  }
}
</style>
