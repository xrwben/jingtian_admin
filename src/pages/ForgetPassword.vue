<template>
  <div id="ForgetPassword">
    <div class="forget_wrapper">
      <div class="forget_title">
        <h2>找回密码</h2>
      </div>
      <div class="forget_input">
        <ul>
          <li>
            <i class="iconfont icon-shouji"></i>
            <input type="text" v-model.trim="forget.phone" placeholder="请输入您的手机号码">
          </li>
          <li>
            <i class="iconfont icon-duanxin"></i>
            <input type="text" v-model.trim="forget.captcha" placeholder="请输入验证码">
            <p class="verificationCode">
              <a v-if="!showInterval" href="javascript:void(0)" @click="getPhoneVerification">获取验证码</a>
              <a v-if="showInterval" href="javascript:void(0)">{{ second }}s</a>
            </p>
          </li>
          <li>
            <i class="iconfont icon-denglumimax"></i>
            <input type="password" v-model.trim="forget.newPassword" placeholder="请输入您的新密码">
          </li>
          <li>
            <button @click="submitForm">提交</button>
          </li>
          <li class="clearfix">
            <span><router-link :to="{name: 'Login'}">登录>></router-link></span>
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
        forget: {
          phone: '',
          captcha: '',
          newPassword: ''
        },
        showInterval: false,
        second: 60
      }
    },
    methods: {
      // 获取短信验证码
      getPhoneVerification () {
        if (!this.forget.phone) {
          this.$message.warning('请先输入手机号！')
        } else if (!/^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(this.forget.phone)) {
          this.$message.warning('请先输入正确格式的手机号！')
        } else {
          this.showInterval = true
          let timer = setInterval(() => {
            this.second = this.second - 1
            if (this.second === 0) {
              clearInterval(timer)
              this.showInterval = false
              this.second = 60
            }
          }, 1000)
          this.axios({
            method: 'POST',
            url: '/jingtian/sysuser/getcaptcha',
            data: this.toFormData({
              phone: this.forget.phone
            })
          }).then((result) => {
            if (result.data.code === 0) {
            } else {
              this.$message({
                message: result.data.msg,
                type: 'error'
              })
            }
          })
        }
      },
      // 提交
      submitForm () {
        if (!this.forget.phone || !this.forget.captcha || !this.forget.newPassword) {
          this.$message.warning('请完善信息！')
        } else if (!/^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(this.forget.phone)) {
          this.$message.warning('请输入正确格式的手机号！')
        } else if (this.forget.newPassword.length < 6) {
          this.$message.warning('请输入六位数及以上的密码！')
        } else {
          this.axios({
            method: 'POST',
            url: '/jingtian/sysuser/forgetPassword',
            data: this.toFormData({
              phone: this.forget.phone,
              captcha: this.forget.captcha,
              newPassword: this.forget.newPassword
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$message({
                message: '密码已重置，请登录！',
                type: 'success'
              })
              this.$router.push('/login')
            } else {
              this.$message({
                message: result.data.msg,
                type: 'error'
              })
            }
          })
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #ForgetPassword{
    height: 100%;
    background: url("../assets/loginBg.jpg") center;
    background-size: 100% 100%;
    overflow: hidden;
    position: relative;
  }
  .forget_wrapper{
    width: 420px;
    background: rgba(255,255,255,1);
    border-radius: 4px ;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .forget_title{
      height: 64px;
      background:rgba(98,174,255,1);
      border-radius: 4px 4px 0px 0px;
      h2{
        line-height: 64px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        letter-spacing: 5px;
      }
    }
    .forget_input{
      margin-top: 30px;
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
        .verificationCode{
          position: absolute;
          right: 0;
          top: 0;
          /*background: #fff;*/
          margin-top: 1px;
          a{
            color: #333;
            font-size: 14px;
            border-left: 1px solid #999;
            padding: 0 10px;
            outline: none;
          }
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
      ul li:nth-child(4){
        margin-bottom: 0;
        border: 0;
      }
      ul li:nth-child(5){
        margin-bottom: 0;
        border: 0;
      }
    }
  }
</style>
