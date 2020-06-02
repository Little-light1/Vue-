<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像 -->
      <div class="image">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!-- 登录表单 -->
      <el-form ref="loginFormRef" class="login_form" :rules="loginFormRules" :model="loginForm">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
          ></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="success" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据的绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度不超过10个字符', trigger: 'blur' }
        ],
        // 验证密码
        password: [{ required: true, message: '请输入密码', tigger: 'blur' }]
      }
    }
  },
  methods: {
    // 点击重置按钮  重置登录表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('login', this.loginForm)

        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功!')
        // 1.将登录成功之后token，保存到客户端的sessionStorage中
        // 1.1将项目中除了登录之外的其他Api窗口，必须在登录之后才能访问
        // 1.2 token只应在当前网页打开期间生效，所以将token保存在sessionStorage中
        console.log(res)
        window.sessionStorage.setItem('token', res.data.token)

        // 2 通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  background-color: skyblue;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.image {
  height: 130px;
  width: 130px;
  border: solid 1px black;
  border-radius: 50%;
  padding: 10px;
  background-color: #ddd;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
