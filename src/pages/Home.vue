<template>
  <div id="Home">
    <el-container class="container">
      <el-header class="header">
        <el-row>
          <el-col :span="12">
            <div class="logo">
              <img src="../assets/logo.png">
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info">
              <img src="http://up.qqjia.com/z/face01/face06/facejunyong/junyong04.jpg">
              <span>{{ name }}</span>
              <i class="iconfont icon-tuichu" @click="logOut"></i>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container class="containersub">
        <el-aside class="aside">
          <el-menu :default-active="$route.path" router>
            <div v-for="(item, index) in routerData">
              <el-menu-item :index="item.path" v-if="item.role.indexOf(type) > -1">{{ item.name }}</el-menu-item>
              <!--<el-menu-item :index="item.path">{{ item.name }}</el-menu-item>-->
            </div>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        routerData: [],
        name: JSON.parse(sessionStorage.getItem('user')).name || '景天',
        type: JSON.parse(sessionStorage.getItem('user')).type
      }
    },
    mounted () {
      this.routerData = this.$router.options.routes[2].children
    },
    methods: {
      // 退出登录
      logOut () {
        this.$confirm('确认退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'post',
            url: '/jingtian/sysuser/logout'
          }).then(result => {
            if (result.data.code === 0) {
              this.$router.push('/login')
              sessionStorage.removeItem('user')
              this.$message({
                type: 'success',
                message: '退出成功!'
              })
            }
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消退出！'
          })
        })
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #Home{
    height: 100%;
  }
  .container{
    height: 100%;
  }
  .header{
    height: 80px !important;
    line-height: 80px;
    background: #73b4e4;
    padding: 0 30px;
    .logo{
      height: 80px;
      display:flex;
      align-items:center;
      img{
        width: 120px;
        height: 40px;
      }
    }
    .info{
      height: 80px;
      display:flex;
      align-items:center;
      justify-content: flex-end;
      img{
        width: 40px;
        height: 40px;
        border: 1px solid #e6e6e6;
        border-radius: 50%;
      }
      span{
        padding: 0 30px 0 10px;
      }
      i{
        cursor: pointer;
      }
    }
  }
  .aside{
    width: 150px !important;
    text-align: center;
    overflow: hidden;
    .el-menu{
      height: 100%;
      padding-top: 20px;
      background: #eef1f6;
      div{
        .el-menu-item:hover{
          background: #d1dbe5;
        }
      }
    }
  }
</style>
