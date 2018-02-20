<template>
  <div id="Information">
    <div class="wrapper">
      <div class="title">
        <div class="text">
          <h2>填 / 写 / 信 / 息</h2>
          <p>Fill in the information</p>
        </div>
      </div>
      <div class="form">
        <ul>
          <li>
            <span>公司名称：</span><input type="text" v-model="name" />
          </li>
          <li>
            <span>联系人：</span><input type="text" v-model="contactName" />
          </li>
          <li>
            <span>联系人电话：</span><input type="text" v-model="contact" />
          </li>
          <li>
            <span>地址：</span><input type="text" v-model="address" />
          </li>
          <li>
            <span>网址：</span><input type="text" v-model="urlAddress" />
          </li>
          <li>
            <span>营业执照：</span>
            <div class="img">
              <!--<el-upload-->
                <!--class="avatarUploader"-->
                <!--action="/keygood/web/oss/upload?fileType=1"-->
                <!--accept="image/gif,image/jpeg,image/jpg,image/png"-->
                <!--:show-file-list="false"-->
                <!--:before-upload="beforeAvatarUpload"-->
                <!--:auto-upload="false">-->
                <!--<img v-if="imageUrl_1" :src="imageUrl_1" class="avatar">-->
                <!--<i v-else class="el-icon-plus avatarUploaderIcon"></i>-->
              <!--</el-upload>-->
              <div class="avatarUploader">
                <img v-if="imageUrl_1" :src="imageUrl_1" class="avatar">
                <i v-else class="el-icon-plus avatarUploaderIcon"></i>
                <input class="fileInput" type="file" @change="uploadFile" accept="image/gif,image/jpeg,image/jpg,image/png" value="">
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="btn">
        <el-button class="submit" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        name: '',
        contactName: '',
        contact: '',
        address: '',
        urlAddress: '',
        license1: [],
        imageUrl_1: ''
      }
    },
    methods: {
      // 上传成功的回显方法
      uploadFile (e) {
        var file = e.target.files[0]
        this.license1 = file
        // file对象生成可用的图片
        var URL = window.URL || window.webkitURL
        // 通过 file 生成目标 url
        this.imageUrl_1 = URL.createObjectURL(file)
      },
      // 提交信息
      submit () {
        if (!this.name || !this.contactName || !this.contact || !this.address || !this.urlAddress || !this.license1) {
          this.$message.warning('请完善信息！')
        } else {
          var formData = new FormData()
          formData.append('name', this.name)
          formData.append('contactName', this.contactName)
          formData.append('contact', this.contact)
          formData.append('address', this.address)
          formData.append('urlAddress', this.urlAddress)
          formData.append('license1', this.license1)
          this.axios({
            method: 'POST',
            url: '/jingtian/supplier/save',
            data: formData
          }).then(result => {
            if (result.data.code === 0) {
              this.$message.success('提交信息成功！')
              this.name = ''
              this.contactName = ''
              this.contact = ''
              this.address = ''
              this.urlAddress = ''
              this.license1 = ''
              this.imageUrl_1 = ''
            }
          })
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss">
  #Information{
    .wrapper{
      width: 1196px;
      margin: 50px auto;
      .title{
        width: 100%;
        height: 28px;
        background: url("../assets/information.png") top center;
        .text{
          width: 255px;
          margin: 0px auto;
          text-align: center;
          transform: translateY(-22%);
          h2{
            font-size: 24px;
            letter-spacing: 5px;
          }
          p{
            font-size: 20px;
            color: #010101;
            margin-top: 14px;
          }
        }
      }
      .form{
        text-align: center;
        margin-top: 60px;
        ul {
          li{
            margin-bottom: 20px;
            span{
              width: 120px;
              font-size: 18px;
              line-height: 40px;
              display: inline-block;
            }
            input{
              width: 350px;
              height: 40px;
              border: 1px solid #787878;
              margin-left: 15px;
              margin-top: -1px;
              padding: 0 10px;
              font-size: 20px;
            }
          }
          li:last-of-type{
            width: 650px;
            display: flex;
            margin: 0 auto;
            padding-left: 145px;
            .img{
              width: 500px;
              display: inline-block;
              margin-left: 14px;
              .avatarUploader {
                width: 500px;
                height: 256px;
                border: 1px solid #787878;
                /*margin: 0;*/
                margin-bottom: 30px;
                position: relative;
                .avatarUploaderIcon {
                  font-size: 48px;
                  color: #8c939d;
                  width: 500px;
                  height: 256px;
                  line-height: 256px;
                  text-align: center;
                }
                .avatar {
                  width: 500px;
                  height: 256px;
                  display: block;
                }
                .fileInput{
                  width: 500px;
                  height: 256px;
                  position: absolute;
                  left: -25px;
                  top: 0px;
                  opacity: 0;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
      .btn{
        text-align: center;
        margin-top: 50px;
        .submit{
          width: 300px;
          height: 50px;
          background: #484848;
          color: #ffffff;
          font-size: 22px;
          border-radius: 10px;
          letter-spacing: 10px;
        }
      }
    }
  }
</style>
