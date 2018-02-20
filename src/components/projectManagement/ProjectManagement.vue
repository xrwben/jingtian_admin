<template>
  <div id="ProjectManagement">
    <div v-if="isShow === 1">
      <!-- toolbar -->
      <el-row>
        <el-form :model="form">
          <el-col :span="5">
            <el-form-item label="项目状态：">
              <el-select v-model.trim="form.state" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="待成交" value="1"></el-option>
                <el-option label="已成交" value="2"></el-option>
                <el-option label="已关闭" value="3"></el-option>
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
            <el-input class="search" placeholder="" v-model.trim="form.searchVaule">
              <el-button slot="append" icon="el-icon-search" @click="optionChange"></el-button>
            </el-input>
          </el-col>
        </el-form>
      </el-row>

      <!-- table -->
      <el-table :data="tableDatas" resizable>
        <el-table-column label="项目单号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.projectId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | projectState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目更新时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交商" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.supplierName || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交金额(元)" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.dealAmount || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="viewDetails(scope.row.projectId)">详情</el-button>
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

    <div class="details" v-if="isShow === 2">
      <p class="close" @click="isShowState(1)"><i class="iconfont icon-guanbi"></i></p>
      <!-- 需求单信息 -->
      <div class="wrapper">
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
              <div>{{ detailsInfo.demand.companyName }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>联系人：</span>
              <div>{{ detailsInfo.demand.contactName }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>联系方式：</span>
              <div>{{ detailsInfo.demand.contact1 }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>邮箱：</span>
              <div>{{ detailsInfo.demand.email }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>需求状态：</span>
              <div>{{ detailsInfo.demand.status | needsFormState }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>需求类型：</span>
              <div>{{ detailsInfo.demand.type | needsFormType }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>创建时间：</span>
              <div>{{ detailsInfo.demand.createTime | dateFormat }}</div>
            </div>
          </li>
          <li class="needCon">
            <div class="display_box">
              <span>需求内容：</span>
              <p>{{ detailsInfo.demand.demand }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- 跟进人信息 -->
      <div class="wrapper">
        <ul>
          <li>
            <div class="display_box">
              <span>跟进人：</span>
              <div>{{ detailsInfo.demand.sysuser.name }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>分配时间：</span>
              <div>{{ detailsInfo.demand.sendTime | dateFormat }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>客户联系电话2：</span>
              <div>{{ detailsInfo.demand.contact2 }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>客户地址：</span>
              <div class="address">{{ detailsInfo.demand.province }}{{ detailsInfo.demand.city }}{{ detailsInfo.demand.county }} {{ detailsInfo.demand.address }}</div>
            </div>
          </li>
          <li class="needCon">
            <div class="display_box">
              <span>项目说明：</span>
              <p>{{ detailsInfo.demand.introduction }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- 项目单信息 -->
      <div class="wrapper">
        <ul>
          <li>
            <div class="display_box">
              <span>项目单号：</span>
              <div>{{ detailsInfo.projectId }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>项目名称：</span>
              <div>{{ detailsInfo.name }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>产品类型：</span>
              <div>{{ detailsInfo.productType }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>产品型号：</span>
              <div>{{ detailsInfo.productModel }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>跟进人：</span>
              <div>{{ detailsInfo.demand.sysuser.name }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>项目创建时间：</span>
              <div>{{ detailsInfo.createTime | dateFormat }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>项目更新时间：</span>
              <div>{{ detailsInfo.updateTime | dateFormat }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>项目状态：</span>
              <div>{{ detailsInfo.status | projectState }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>成交商：</span>
              <div>{{ detailsInfo.supplierName || '--' }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>成交金额（元）：</span>
              <div>{{ detailsInfo.dealAmount || '--' }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>已有供应商：</span>
              <div>{{ detailsInfo.projectSuppliers.length }}</div>
            </div>
          </li>
          <li class="notes">
            <div class="display_box">
              <span>备注：</span>
              <div class="list">
                <div class="item" v-for="item in detailsInfo.notes">
                  <p>{{ item.note }}</p>
                  <span>{{ item.createTime | tiemFormat }}</span>
                </div>
              </div>
            </div>
            <a v-if="detailsInfo.status === 1" @click="showPopup('addNotes')">添加</a>
          </li>
        </ul>
      </div>

      <!-- 供应商 -->
      <div class="wrapper established" v-if="detailsInfo.projectSuppliers.length">
        <ul v-for="(item, index) in detailsInfo.projectSuppliers">
          <li>
            <div class="display_box">
              <p>供应商{{ index + 1 }}</p>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>供应商编号</span>
              <span>{{ item.suppliers[0].supplierId }}</span>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>供应商名称</span>
              <span>{{ item.suppliers[0].name }}</span>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>对接人</span>
              <span>{{ item.suppliers[0].contactName }}</span>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>对接人联系方式</span>
              <span>{{ item.suppliers[0].contact }}</span>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>供应商添加时间</span>
              <span>{{ item.createTime | dateFormat }}</span>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>厂商</span>
              <span>{{ item.vendor }}</span>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>厂商对接人</span>
              <span>{{ item.vendorJoinPeople }}</span>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>厂商对接人联系方式</span>
              <span>{{ item.vendorJoinPeopleContact }}</span>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>项目状态</span>
              <span class="projectState">
                <b>{{ item.status | projectState }}</b>
                <a v-if="detailsInfo.status === 1" @click="changeProjectState(item.projectSupplierId)">成交</a>
                <!--<el-select class="select" v-model.trim="item.status.toString()" disabled>-->
                  <!--<el-option label="待成交" value='1'></el-option>-->
                  <!--<el-option label="已成交" value='2'></el-option>-->
                  <!--<el-option label="已关闭" value='3'></el-option>-->
                <!--</el-select>-->
              </span>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>成交金额(元)</span>
              <span v-if="detailsInfo.status === 1"><input type="text" v-model.trim="dealAmount"></span>
              <span v-if="detailsInfo.status !== 1">{{ item.status === 2 ? detailsInfo.dealAmount : '--' }}</span>
            </div>
          </li>
        </ul>
      </div>

      <p class="btn" v-if="detailsInfo.status === 1">
        <el-button type="primary" @click="showPopup('addSupplier')">添加供应商</el-button>
        <el-button @click="changeProjectState()">项目关闭</el-button>
      </p>
    </div>

    <!-- 添加备注弹窗 -->
    <div class="shadow" v-if="isShowPopup === 'addNotes'">
      <div class="wrapper">
        <div class="notesCon">
          <textarea placeholder="请填写备注信息" v-model="note"></textarea>
          <p>
            <el-button size="mini" @click="closePopup">取消</el-button>
            <el-button size="mini" type="primary" @click="confirmAddNotes">保存</el-button>
          </p>
        </div>
      </div>
    </div>

    <!-- 添加供应商弹窗 -->
    <div class="shadow" v-if="isShowPopup === 'addSupplier'">
      <div class="wrapper">
        <div class="addSupplier">
          <ul>
            <li>
              <span>选择供应商：</span>
              <input type="text" v-model="supplier.name" readonly @click="selectSupplier">
              <div v-if="showName" :class="{nameDrop: showName}">
                <nav class="clearfix">
                  <div class="search">
                    <el-input class="searchInput" placeholder="编号、名称、联系人" v-model.trim="searchSupplier">
                      <el-button @click="searchName()" slot="append" class="searchIcon" icon="el-icon-search"></el-button>
                    </el-input>
                  </div>
                </nav>
                <div class="list">
                  <table>
                    <thead>
                    <tr>
                      <th width="80px">编号</th>
                      <th width="220px">供货商</th>
                      <th width="80px">联系人</th>
                      <th width="120px">联系方式</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in supplierDatas" @click="clickSelectedName(item)">
                      <td>{{ item.supplierId }}</td>
                      <td class="ellipsis">{{ item.name }}</td>
                      <td>{{ item.contactName }}</td>
                      <td>{{ item.contact }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </li>
            <li>
              <span>对接人：</span>
              <input type="text" v-model.trim="supplier.joinPeople">
            </li>
            <li>
              <span>对接人联系方式：</span>
              <input type="text" v-model.trim="supplier.joinPeopleContact">
            </li>
            <li>
              <span>厂商：</span>
              <input type="text" v-model.trim="supplier.vendor">
            </li>
            <li>
              <span>厂商对接人：</span>
              <input type="text" v-model.trim="supplier.vendorJoinPeople">
            </li>
            <li>
              <span>厂商对接人联系方式：</span>
              <input type="text" v-model.trim="supplier.vendorJoinPeopleContact">
            </li>
          </ul>
          <p>
            <el-button size="mini" @click="closePopup">取消</el-button>
            <el-button size="mini" type="primary" @click="confirmAddSupplier">确定</el-button>
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
        isShow: 1,
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
        isShowPopup: false,
        detailsInfo: {},
        showName: false, // 是否显示选择供应商弹窗
        searchSupplier: '', // 获取供应商的搜索关键字
        supplierDatas: [],  // 供应商列表数据
        supplier: {
          name: '',
          supplierId: '',
          joinPeople: '',
          joinPeopleContact: '',
          vendor: '',
          vendorJoinPeople: '',
          vendorJoinPeopleContact: ''
        },
        note: '', // 备注信息
        dealAmount: '' // 成交金额
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
          url: '/jingtian/project/list',
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
          } else {
            this.$message({
              message: result.data.msg,
              type: 'error'
            })
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
      // 显示不同的页面
      isShowState (i) {
        this.isShow = i
      },
      // 查看详情
      viewDetails (id) {
        this.axios({
          method: 'GET',
          url: '/jingtian/project/info',
          params: {
            projectId: id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.detailsInfo = result.data.project
            this.isShowState(2)
          }
        })
      },
      // 显示弹出层
      showPopup (type) {
        if (type === 'addSupplier') {
          this.supplier.name = ''
          this.supplier.supplierId = ''
          this.supplier.joinPeople = ''
          this.supplier.joinPeopleContact = ''
          this.supplier.vendor = ''
          this.supplier.vendorJoinPeople = ''
          this.supplier.vendorJoinPeopleContact = ''
          this.isShowPopup = 'addSupplier'
          this.getSupplier()
        } else if (type === 'addNotes') {
          this.note = ''
          this.isShowPopup = 'addNotes'
        }
      },
      // 关闭弹出层
      closePopup () {
        this.isShowPopup = false
      },
      // 确认添加备注
      confirmAddNotes () {
        this.axios({
          method: 'POST',
          url: '/jingtian/note/save',
          data: this.toFormData({
            projectId: this.detailsInfo.projectId,
            note: this.note
          })
        }).then(result => {
          if (result.data.code === 0) {
            this.$message.success('添加备注成功！')
            this.viewDetails(this.detailsInfo.projectId)
            this.closePopup()
          }
        })
      },
      // 点击弹出选择供应商弹窗
      selectSupplier () {
        if (this.showName) {
          this.showName = false
        } else {
          this.showName = true
        }
      },
      // 获取供应商
      getSupplier () {
        this.axios({
          method: 'GET',
          url: '/jingtian/supplier/list',
          params: {
            status: 2,
            keyword: this.searchSupplier
          }
        }).then(result => {
          if (result.data.code === 0) {
            this.supplierDatas = result.data.page.list
          }
        })
      },
      // 搜索供应商信息
      searchName () {
        this.getSupplier()
      },
      // 点击选择供应商
      clickSelectedName (info) {
        this.supplier.name = info.name
        this.supplier.supplierId = info.supplierId
        this.showName = false
      },
      // 确认添加供应商
      confirmAddSupplier () {
        this.axios({
          method: 'POST',
          url: '/jingtian/projectsupplier/save',
          data: this.toFormData({
            projectId: this.detailsInfo.projectId,
            supplierId: this.supplier.supplierId,
            joinPeople: this.supplier.joinPeople,
            joinPeopleContact: this.supplier.joinPeopleContact,
            vendor: this.supplier.vendor,
            vendorJoinPeople: this.supplier.vendorJoinPeople,
            vendorJoinPeopleContact: this.supplier.vendorJoinPeopleContact
          })
        }).then(result => {
          if (result.data.code === 0) {
            this.$message.success('添加供应商成功！')
            this.viewDetails(this.detailsInfo.projectId)
            this.closePopup()
          }
        })
      },
      // 改变供应商的状态
      changeProjectState (id) {
        if (id) {
          if (!this.dealAmount) {
            this.$message.warning('请填写成交金额！')
          } else {
            this.axios({
              method: 'POST',
              url: '/jingtian/project/update',
              data: this.toFormData({
                projectId: this.detailsInfo.projectId,
                projectSupplierId: id,
                dealAmount: this.dealAmount
              })
            }).then(result => {
              if (result.data.code === 0) {
                this.$message.success('项目交易成功！')
                this.isShowState(1)
                this.getDatas()
              }
            })
          }
        } else {
          this.axios({
            method: 'POST',
            url: '/jingtian/project/update',
            data: this.toFormData({
              projectId: this.detailsInfo.projectId
            })
          }).then(result => {
            if (result.data.code === 0) {
              this.$message.success('项目已经关闭！')
              this.isShowState(1)
              this.getDatas()
            }
          })
        }
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
          }
        }
        li.needCon{
          border: 0;
          .display_box{
            p{
              line-height: 20px;
              margin-top: 10px;
              padding: 3px 8px;
              width: 250px;
              max-height: 80px;
              border: 1px solid #c5c5c5;
              overflow: auto;
            }
          }
        }
        li.notes{
          border: 0;
          >.display_box{
            padding-left: 50px;
            >span{
              width: 50px;
            }
            .list{
              width: 85%;
              border: 1px solid #c5c5c5;
              padding: 10px;
              vertical-align: baseline;
              margin-top: 10px;
              .item{
                margin-bottom: 5px;
                >p{
                  line-height: 25px;
                }
                >span{
                  line-height: 15px;
                  color: #666;
                  font-size: 12px;
                }
              }
            }
          }
          >a{
            width: 30px;
            color: #5090d3;
            cursor: pointer;
            float: right;
          }
        }
        li.btn{
          text-align: center;
          border: 0;
          margin-top: 20px;
        }
      }
    }
    .established{
      ul{
        li{
          border: 1px solid #c5c5c5;
          border-bottom: none;
          >.display_box{
            padding-left: 0px;
            text-align: center;
            p{
              width: 100%;
              font-size: 18px;
              line-height: 40px;
            }
            span{
              width: 50%;
              >b{
                border: 1px solid #c5c5c5;
                padding: 3px 10px;
                margin-right: 15px;
              }
              >a{
                color: #5090D3;
                font-size: 12px;
                cursor: pointer;
              }
              >input{
                border: 1px solid #c5c5c5;
                height: 28px;
                padding: 0 10px;
              }
            }
          }
        }
        li:last-of-type{
          border-bottom: 1px solid #c5c5c5;
        }
      }
    }
    >p{
      text-align: center;
      padding: 10px 0 20px;
    }
  }
  .shadow{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    position: fixed;
    left: 0;
    top: 0;
    .wrapper{
      width: 500px;
      background: #fff;
      box-shadow: 0 0 5px rgba(255,255,255,0.5);
      border-radius: 5px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .addSupplier{
        text-align: center;
        padding: 30px 50px 20px;
        ul li{
          height: 35px;
          line-height: 35px;
          text-align: center;
          margin-bottom: 20px;
          span{
            width: 150px;
            display: block;
            float: left;
            text-align: right;
          }
          input{
            width: 200px;
            height: 100%;
            padding: 0 10px;
            border: 1px solid #c5c5c5;
            float: right;
          }
        }
        ul li:first-of-type{
          position: relative;
          input{
            cursor: pointer;
          }
          .nameDrop {
            width: 500px;
            box-shadow: 1px 0px 10px rgba(102, 102, 102, 0.57);
            background: #fff;
            padding: 10px 0;
            position: absolute;
            left: 178px;
            top: 40px;
            z-index: 10;
            > nav {
              margin-bottom: 10px;
              padding: 0 10px;
              .search {
                width: 240px;
                float: right;
              }
            }
            .list{
              max-height: 210px;
              overflow: auto;
              >table{
                width: 100%;
                text-align: center;
                font-size: 14px;
                table-layout: fixed;
                thead{
                  tr{
                    height: 35px;
                    background: #EFF3F6;
                    border-bottom: 1px solid #EFF3F6;
                    color: #666;
                  }
                }
                tbody{
                  tr{
                    height: 35px;
                    border-bottom: 1px solid #EFF3F6;
                    color: #333;
                    td:last-of-type{
                      a{
                        color: #5090D3;
                        margin: 0 10px;
                      }
                    }
                  }
                  tr:hover{
                    background: #EFFFF8;
                    cursor: pointer;
                  }
                }
              }
            }
          }
        }
        p{
          margin-top: 30px;
        }
      }
      .notesCon{
        text-align: center;
        padding: 30px 50px 20px;
        textarea{
          width: 100%;
          height: 100px;
          padding: 5px 10px;
          line-height: 20px;
        }
        p{
          margin-top: 20px;
        }
      }
    }
  }
</style>

