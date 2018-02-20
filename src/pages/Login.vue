<template>
  <div id="Login">
    <div class="login_wrapper">
      <div class="login_title">
        <h2>登录</h2>
      </div>
      <div class="login_input">
        <ul>
          <li>
            <i class="iconfont icon-dengluyonghuming"></i>
            <input type="text" spellcheck="false" v-model.trim="login.account" @keydown.enter="submitForm" autofocus placeholder="请输入手机号码">
          </li>
          <li>
            <i class="iconfont icon-denglumimax"></i>
            <input type="password" v-model.trim="login.password" @keydown.enter="submitForm" placeholder="请输入密码">
          </li>
          <li class="clearfix">
            <span><router-link :to="{name: 'ForgetPassword'}">忘记密码?</router-link></span>
          </li>
          <li>
            <button @click.prevent="submitForm" :loading="showLoading">{{ loginTxt }}</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        login: {
          account: '',
          password: ''
        },
        loginTxt: '登录',
        showLoading: false
      }
    },
    methods: {
      submitForm () {
        if (!this.login.account || !this.login.password) {
          this.$message.warning('登录信息不能为空！')
        } else {
          this.loginTxt = '登录中'
          this.axios({
            method: 'POST',
            url: '/jingtian/sysuser/login',
            data: this.toFormData({
              username: this.login.account,
              password: this.login.password
            })
          }).then((result) => {
            if (result.data.code === 0) {
              // 把数据保存在本地
              sessionStorage.setItem('user', JSON.stringify(result.data.user))
              // 登录跳转
              if (result.data.user.type === 1) {
                this.$router.push('/needsformmanagement')
              } else {
                this.$router.push('/needsformmanagement')
              }
            }
          }).catch(() => {
            this.loginTxt = '登录'
          })
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #Login{
    height: 100%;
    background: url("../assets/loginBg.jpg") center;
    background-size: 100% 100%;
    overflow: hidden;
    position: relative;
  }
  .login_wrapper{
    width: 420px;
    background: rgba(255,255,255,1);
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .login_title{
      height: 64px;
      background:rgba(98,174,255,1);
      border-radius: 4px 4px 0px 0px;
      h2{
        line-height:64px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        letter-spacing: 5px;
      }
    }
    .login_input{
      margin-top: 35px;
      ul li{
        width:350px;
        height:40px;
        border-radius: 4px ;
        margin: 0 auto 20px;
        line-height: 40px;
        position: relative;
        i{
          font-size: 20px;
          color: #999;
          position: absolute;
          left: 15px;
          top: 0;
          padding: 0;
        }
        input{
          width: 100%;
          height: 100%;
          border: 1px solid #c5c5c5;
          text-indent: 50px;
          border-radius: 4px;
          /*color: #999;*/
        }
        span a{
          font-size: 14px;
          color: #5090D3;
        }
        span:first-of-type{
          float: left;
          margin-left: 5px;
        }
        span:last-of-type{
          float: right;
          margin-right: 5px;
        }
        button{
          width: 100%;
          height: 100%;
          background: #62aeff;
          border: 1px solid #e3e3e3;
          border-radius: 4px;
          color: #fff;
          font-size: 18px;
          letter-spacing: 20px;
          cursor: pointer;
        }
      }
      ul li:nth-child(3){
        margin-top: -20px;
        margin-bottom: 15px;
        border: 0;
        height: 30px;
        line-height: 30px;
      }
      ul li:nth-child(4){
        border: 0;
      }
    }
  }
</style>
