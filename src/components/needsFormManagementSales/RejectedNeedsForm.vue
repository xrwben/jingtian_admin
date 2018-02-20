<template>
  <div id="RejectedNeedsForm">
    <div v-if="!isShowPopup">
      <!-- table -->
      <el-table :data="tableDatas" resizable>
        <el-table-column label="需求单号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.demandId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.contact1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="需求类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type | needsFormType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="viewDetails(scope.row.demandId)">详细</el-button>
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

    <!-- 详情 -->
    <div class="details" v-if="isShowPopup">
      <p class="close" @click="closePopup"><i class="iconfont icon-guanbi"></i></p>
      <!-- 需求信息 -->
      <div class="wrapper needsInfo">
        <ul>
          <li>
            <div class="display_box">
              <span>需求单号：</span>
              <div>{{ detailsInfo.demandId }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>公司名称：</span>
              <div>{{ detailsInfo.companyName }}</div>
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
              <div>{{ detailsInfo.contact1 }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>邮箱：</span>
              <div>{{ detailsInfo.email }}</div>
            </div>
          </li>
          <li class="needCon">
            <div class="display_box">
              <span>需求内容：</span>
              <p>{{ detailsInfo.demand }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- 新增信息 -->
      <div class="wrapper addInfo">
        <ul>
          <li>
            <div class="display_box">
              <span>客户联系电话2：</span>
              <input class="phone" type="text" v-model.trim="form.phone" readonly>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>客户地址：</span>
              <div class="address">
                <el-select class="selectAddress" v-model.trim="form.province" @change="changeProvince" disabled>
                  <el-option :label="province" :value="province" v-for="province in provincesArray" :key="province"></el-option>
                </el-select>
                <el-select class="selectAddress" v-model.trim="form.city" @change="changeCity" disabled>
                  <el-option :label="city" :value="city" v-for="city in citysArray" :key="city"></el-option>
                </el-select>
                <el-select class="selectAddress" v-model.trim="form.county" disabled>
                  <el-option :label="county" :value="county" v-for="county in countysArray" :key="county"></el-option>
                </el-select>
              </div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span></span>
              <div class="detailsAddress">
                <textarea placeholder="详细地址" v-model.trim="form.detailsAddress" readonly></textarea>
              </div>
            </div>
          </li>
          <li class="needCon">
            <div class="display_box">
              <span>项目说明：</span>
              <textarea v-model.trim="form.notes" readonly></textarea>
            </div>
          </li>
          <li class="needCon" v-if="detailsInfo.status !== 2">
            <div class="display_box">
              <span>驳回原因：</span>
              <textarea v-model.trim="form.reason" readonly></textarea>
            </div>
          </li>
          <li class="btn">
            <el-button type="primary" @click="confirmEdit">去修改</el-button>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
  import address from '../../../static/address3.json'
  export default {
    data () {
      return {
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        tableDatas: [],
        isShowPopup: false,
        detailsInfo: {},
        demandId: '',
        form: {
          phone: '',
          province: '',
          city: '',
          county: '',
          detailsAddress: '',
          notes: '',
          reason: ''
        },
        provincesArray: Object.keys(address),
        citysArray: [],
        countysArray: []
      }
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取列表数据
      getDatas () {
        this.axios({
          method: 'POST',
          url: '/jingtian/demand/list',
          params: {
            status: 3,
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
      // 查看详情
      viewDetails (id) {
        this.axios({
          method: 'GET',
          url: '/jingtian/demand/info',
          params: {
            demandId: id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.detailsInfo = result.data.demand
            this.isShowPopup = true
            this.demandId = id
            this.form.phone = result.data.demand.contact2
            this.form.province = result.data.demand.province
            this.form.city = result.data.demand.city
            this.form.county = result.data.demand.county
            this.form.detailsAddress = result.data.demand.address
            this.form.notes = result.data.demand.introduction
            this.form.reason = result.data.demand.rejectExplain
          }
        })
      },
      // 关闭详情
      closePopup () {
        this.isShowPopup = false
      },
      // 省市区联动
      changeProvince () {
        this.citysArray = Object.keys(address[this.form.province])
        this.form.city = this.citysArray[0]
        this.countysArray = address[this.form.province][this.form.city]
        this.form.county = this.countysArray[0]
      },
      changeCity () {
        this.countysArray = address[this.form.province][this.form.city]
        this.form.county = this.countysArray[0]
      },
      // 修改
      confirmEdit () {
        this.axios({
          method: 'POST',
          url: '/jingtian/demand/handleAgain',
          data: this.toFormData({
            demandId: this.demandId
          })
        }).then(result => {
          if (result.data.code === 0) {
            this.$message.success('请去去未处理需求单列表修改！')
            this.closePopup()
            this.getDatas()
          }
        })
      }
    }
  }
</script>

<style type="text/css" lang="scss">
  .details {
    background: #eef1f6;
    .close {
      text-align: right;
      padding: 15px 15px 10px 0px;
      i {
        font-size: 20px;
        cursor: pointer;
      }
    }
    > .wrapper {
      padding: 0px 0px 20px;
      ul {
        width: 500px;
        margin: 0px auto;
        padding: 20px 80px;
        background: #fff;
        li {
          border-bottom: 1px solid #c5c5c5;
          > .display_box {
            line-height: 35px;
            padding-left: 100px;
            >span {
              width: 120px;
              display: block;
            }
          }
        }
        li.selectAddress {
          border-bottom: none;
        }
        li.needCon {
          border: 0;
          .display_box {
            textarea {
              line-height: 20px;
              margin-top: 10px;
              padding: 3px 8px;
              width: 260px;
              min-height: 80px;
              max-height: 80px;
              border: 1px solid #c5c5c5;
              overflow: auto;
            }
          }
        }
        li.btn {
          text-align: center;
          border: 0;
          margin-top: 20px;
        }
      }
    }
    >.addInfo{
      ul{
        li{
          border: none;
          > .display_box{
            line-height: 40px;
            padding-left: 0px;
            .phone {
              width: 260px;
              height: 35px;
              border: 1px solid #c5c5c5;
              padding: 0px 8px;
            }
            .address{
              margin-top: 10px;
            }
            .address {
              width: 76%;
            }
            .detailsAddress {
              margin-top: 5px;
              width: 60%;
              textarea {
                width: 100%;
                height: 50px;
                max-height: 50px;
                border: 1px solid #c5c5c5;
                border-radius: 4px;
                padding: 3px 8px;
              }
            }
          }
        }
      }
    }
  }
</style>

