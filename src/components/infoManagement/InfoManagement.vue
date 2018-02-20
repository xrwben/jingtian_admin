<template>
  <div id="InfoManagement">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="clickTabs">
          <el-tab-pane label="短信" name="Message">
            <div class="con clearfix" v-if="activeName === 'Message'">
              <div v-for="item in tableDatas">{{ item.contact }}</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="邮箱" name="Mail">
            <div class="con clearfix" v-if="activeName === 'Mail'">
              <div v-for="item in tableDatas">{{ item.email }}</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        activeName: 'Message',
        tableDatas: []
      }
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取列表数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/jingtian/sysuser/list'
        }).then((result) => {
          if (result.data.code === 0) {
            this.tableDatas = result.data.page.list
          }
        })
      },
      clickTabs () {
        this.getDatas()
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  .con{
    >div{
      width: 25%;
      float: left;
      line-height: 40px;
    }
  }
</style>
