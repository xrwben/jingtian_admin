<template>
  <div id="SupplierManagement">
    <div v-if="!isShow">
      <!-- toolbar -->
      <el-row>
        <el-form :model="form">
          <el-col :span="5">
            <el-form-item label="供应商状态：">
              <el-select v-model.trim="form.state" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="待审核" value="1"></el-option>
                <el-option label="已审核" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">
              <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model.trim="form.startTime" @change="optionChange"></el-date-picker>
              —
              <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model.trim="form.endTime" @change="optionChange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-input class="search" placeholder="编号、名称、联系人" v-model.trim="form.searchVaule">
              <el-button slot="append" icon="el-icon-search" @click="optionChange"></el-button>
            </el-input>
          </el-col>
        </el-form>
      </el-row>

      <!-- table -->
      <el-table :data="tableDatas" resizable>
        <el-table-column label="供货商编号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.supplierId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="供应商名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.contactName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.contact }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="供应商状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | supplierState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="viewDetails(scope.row.supplierId)">详细</el-button>
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

    <div class="details" v-if="isShow">
      <p class="close" @click="closePopup"><i class="iconfont icon-guanbi"></i></p>
      <div class="wrapper undistributed">
        <ul>
          <li>
            <div class="display_box">
              <span>供应商编号：</span>
              <div>{{ detailsInfo.supplierId }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>供应商名称：</span>
              <div>{{ detailsInfo.name }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>联系人：</span>
              <div>{{ detailsInfo.contactName }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>联系方式：</span>
              <div>{{ detailsInfo.contact }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>供应商状态：</span>
              <div>{{ detailsInfo.status | supplierState }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>审核通过时间：</span>
              <div>{{ detailsInfo.updateTime | dateFormat }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>地址：</span>
              <div class="address">{{ detailsInfo.address }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>网址：</span>
              <div>{{ detailsInfo.urlAddress }}</div>
            </div>
          </li>
          <li class="needCon">
            <div class="display_box">
              <span>营业执照：</span>
              <div class="img">
                <img :src="imgPaths[0]">
                <img :src="imgPaths[1]">
              </div>
            </div>
          </li>
          <li class="btn" v-if="detailsInfo.status === 1">
            <el-button type="warning" @click="reject">不通过</el-button>
            <el-button type="primary" @click="pass">通过</el-button>
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
        form: {
          state: '',
          startTime: '',
          endTime: '',
          searchVaule: ''
        },
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        tableDatas: [],
        isShow: false,
        detailsInfo: {},
        imgPaths: []
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
          url: '/jingtian/supplier/list',
          params: {
            status: this.form.state,
            startTime: this.form.startTime,
            endTime: this.form.endTime,
            keyword: this.form.searchVaule,
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
      optionChange () {
        this.getDatas()
      },
      // 查看详情
      viewDetails (id) {
        this.axios({
          method: 'GET',
          url: '/jingtian/supplier/info',
          params: {
            supplierId: id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.detailsInfo = result.data.supplier
            this.imgPaths = result.data.paths
            this.isShow = true
          }
        })
      },
      // 关闭弹出层
      closePopup () {
        this.isShow = false
      },
      // 审核通过
      pass () {
        this.axios({
          method: 'POST',
          url: '/jingtian/supplier/pass',
          data: this.toFormData({
            supplierId: this.detailsInfo.supplierId
          })
        }).then((result) => {
          if (result.data.code === 0) {
            this.$message.success('审核成功！')
            this.closePopup()
            this.getDatas()
          }
        })
      },
      // 审核不通过
      reject () {
        this.axios({
          method: 'POST',
          url: '/jingtian/supplier/reject',
          data: this.toFormData({
            supplierId: this.detailsInfo.supplierId
          })
        }).then((result) => {
          if (result.data.code === 0) {
            this.$message.success('审核成功！')
            this.closePopup()
            this.getDatas()
          }
        })
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  .details{
    background: #eef1f6;
    .close{
      text-align: right;
      padding: 15px 15px 10px 0px;
      i{
        font-size: 20px;
        cursor: pointer;
      }
    }
    >.wrapper{
      padding: 0px 0px 20px;
      ul{
        width: 500px;
        margin: 0px auto;
        padding: 20px 80px;
        background: #fff;
        li{
          border-bottom: 1px solid #c5c5c5;
          >.display_box{
            line-height: 35px;
            padding-left: 100px;
            span{
              width: 120px;
              display: block;
            }
            .address{
              width: 70%;
            }
            .img{
              width: 250px;
              img{
                width: 100%;
                height: 150px;
                border: 1px solid #c5c5c5;
                display: block;
                margin-top: 10px;
              }
            }
          }
        }
        li.needCon{
          border: 0;
        }
        li.btn{
          text-align: center;
          border: 0;
          margin-top: 20px;
        }
      }
    }
  }
</style>

