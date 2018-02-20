<template>
  <div id="AccountManagement">
    <div>
      <!-- toolbar -->
      <el-row class="addBtn">
        <el-col :span="2" :offset="22">
          <el-button type="primary" @click="addEdit()">新增账号</el-button>
        </el-col>
      </el-row>

      <!-- table -->
      <el-table :data="tableDatas" resizable>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.contact}}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工作状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | accountState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type | accountType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.type !== 1" size="small" type="primary" @click="addEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-row class="pagination">
        <el-col :span="24">
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize">
          </el-pagination>
        </el-col>
      </el-row>
    </div>


    <!-- 添加供应商弹窗 -->
    <div class="shadow" v-if="isShowPopup">
      <div class="wrapper">
        <div class="addEditAccount">
          <ul>
            <li>
              <span>姓名：</span>
              <input type="text" v-model.trim="account.name" :readonly="readonly">
            </li>
            <li>
              <span>联系方式：</span>
              <input type="text" v-model.trim="account.contact" :readonly="readonly">
            </li>
            <li>
              <span>邮箱：</span>
              <input type="text" v-model.trim="account.email" :readonly="readonly">
            </li>
            <li>
              <span>工作状态：</span>
              <el-select class="accountSelect" v-model.trim="account.state">
                <el-option label="在职" value="1"></el-option>
                <el-option label="离职" value="2"></el-option>
              </el-select>
            </li>
            <li>
              <span>账号类型：</span>
              <el-select class="accountSelect" v-model.trim="account.type">
                <el-option label="主管" value="2"></el-option>
                <el-option label="销售" value="3"></el-option>
              </el-select>
            </li>
          </ul>
          <p>
            <el-button @click="closePopup">取消</el-button>
            <el-button type="primary" @click="confirmAddEdit">确定</el-button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        tableDatas: [],
        isShowPopup: false,
        account: {
          name: '',
          contact: '',
          email: '',
          state: '1',
          type: '2',
          sysUserId: ''
        },
        readonly: false
      }
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取列表数据
      getDatas () {
        this.axios({
          method: 'get',
          url: '/jingtian/sysuser/list',
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.tableDatas = result.data.page.list
            this.totalSize = result.data.page.totalCount
          }
        })
      },
      // 改变每页条数
      sizeChange (val) {
        this.pageSize = val
        this.getDatas()
      },
      currentChange (val) {
        this.currentPage = val
        this.getDatas()
      },
      // 点击新增或编辑弹窗
      addEdit (info) {
        this.isShowPopup = true
        if (info) {
          this.account.name = info.name
          this.account.contact = info.contact
          this.account.email = info.email
          this.account.state = info.status.toString()
          this.account.type = info.type.toString()
          this.account.sysUserId = info.sysUserId
          this.readonly = true
        } else {
          this.account.name = ''
          this.account.contact = ''
          this.account.email = ''
          this.account.state = '1'
          this.account.type = '2'
          this.account.sysUserId = ''
        }
      },
      // 确认新增或修改
      confirmAddEdit () {
        if (!this.account.name || !this.account.contact || !this.account.email) {
          this.$message.warning('请完善信息！')
        } else if (!/^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(this.account.contact)) {
          this.$message.warning('请输入正确格式的手机号！')
        } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.account.email)) {
          this.$message.warning('请输入正确的邮箱地址！')
        } else if (this.account.type === '2' && JSON.parse(sessionStorage.getItem('user')).type === 2) {
          this.$message.warning('无权限创建或更改同级账号信息，请联系超级管理员！')
        } else {
          if (this.account.sysUserId) {
            this.axios({
              method: 'POST',
              url: '/jingtian/sysuser/update',
              data: this.toFormData({
                sysUserId: this.account.sysUserId,
                type: this.account.type,
                status: this.account.state
              })
            }).then(result => {
              if (result.data.code === 0) {
                this.$message.success('修改成功!')
                this.closePopup()
                this.getDatas()
              }
            })
          } else {
            this.axios({
              method: 'POST',
              url: '/jingtian/sysuser/save',
              data: this.toFormData({
                name: this.account.name,
                contact: this.account.contact,
                email: this.account.email,
                type: this.account.type
              })
            }).then(result => {
              if (result.data.code === 0) {
                this.$message.success('添加成功!')
                this.closePopup()
                this.getDatas()
              }
            })
          }
        }
      },
      // 关闭弹出层
      closePopup () {
        this.isShowPopup = false
        this.readonly = false
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  .addBtn{
    margin-bottom: 10px;
  }
  .shadow{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    .wrapper{
      width: 500px;
      background: #fff;
      box-shadow: 0 0 5px rgba(255,255,255,0.5);
      border-radius: 5px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .addEditAccount{
        text-align: center;
        padding: 30px 50px 20px;
        ul li{
          height: 35px;
          line-height: 35px;
          text-align: center;
          margin-bottom: 20px;
          span{
            width: 100px;
            display: block;
            float: left;
            text-align: right;
          }
          input{
            width: 250px;
            height: 100%;
            padding: 0 10px;
            border: 1px solid #dcdfe6;
            float: right;
            border-radius: 4px;
          }
          .accountSelect{
            float: right;
          }
        }
        p{
          margin-top: 35px;
        }
      }
    }
  }
</style>

