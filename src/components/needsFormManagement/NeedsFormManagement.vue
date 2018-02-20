<template>
  <div id="NeedsFormManagement">
    <div v-if="isShow === 1">
      <!-- toolbar -->
      <el-row>
        <el-form :model="form">
          <el-col :span="4">
            <el-form-item label="状态：">
              <el-select v-model.trim="form.state" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="未分配" value="1"></el-option>
                <el-option label="已分配" value="2"></el-option>
                <el-option label="已处理" value="3"></el-option>
                <el-option label="已驳回" value="4"></el-option>
                <el-option label="已立项" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="类型：">
              <el-select v-model.trim="form.type" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="安全" value="1"></el-option>
                <el-option label="优化" value="2"></el-option>
                <el-option label="运维管理" value="3"></el-option>
                <el-option label="容灾备份" value="4"></el-option>
                <el-option label="虚拟化&云计算" value="5"></el-option>
                <el-option label="超融合" value="6"></el-option>
                <el-option label="容器云" value="7"></el-option>
                <el-option label="软件定制" value="8"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="跟进人：">
              <el-select v-model.trim="form.name" @change="optionChange">
                <el-option label="全部" value=""></el-option>
                <el-option :label="item.name" :value="item.sysUserId" v-for="item in peopleDatas" :key="item.sysUserId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="日期">
              <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model.trim="form.startTime" @change="optionChange"></el-date-picker>
              —
              <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model.trim="form.endTime" @change="optionChange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-input class="search" placeholder="单号、公司、联系人" v-model.trim="form.searchVaule">
              <el-button slot="append" icon="el-icon-search" @click="optionChange"></el-button>
            </el-input>
          </el-col>
        </el-form>
      </el-row>

      <!-- table -->
      <el-table :data="tableDatas" resizable>
        <el-table-column label="需求单号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.demandId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.contactName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.contact1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="需求单状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | needsFormState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="需求类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type | needsFormType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.sysuser ? scope.row.sysuser.name : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="viewDetails(scope.row.demandId)">详细</el-button>
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
      <!-- 未分配 -->
      <div class="wrapper undistributed">
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
          <li>
            <div class="display_box">
              <span>需求状态：</span>
              <div>{{ detailsInfo.status | needsFormState }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>需求类型：</span>
              <div>{{ detailsInfo.type | needsFormType }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>创建时间：</span>
              <div>{{ detailsInfo.createTime | dateFormat }}</div>
            </div>
          </li>
          <li class="needCon">
            <div class="display_box">
              <span>需求内容：</span>
              <p>{{ detailsInfo.demand }}</p>
            </div>
          </li>
          <li class="btn" v-if="detailsInfo.status === 1">
            <el-button size="mini" type="primary" @click="showPopup('dispatchPopup')">派单</el-button>
          </li>
        </ul>
      </div>

      <!-- 已分配 -->
      <div class="wrapper distributed" v-if="detailsInfo.status !== 1">
        <ul>
          <li>
            <div class="display_box">
              <span>跟进人：</span>
              <div>{{ detailsInfo.demandId }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>分配时间：</span>
              <div>{{ detailsInfo.sendTime | dateFormat }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>客户联系电话2：</span>
              <div>{{ detailsInfo.contact2 }}</div>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>客户地址：</span>
              <div class="address">{{ detailsInfo.province }}{{ detailsInfo.city }}{{ detailsInfo.county }} {{ detailsInfo.address }}</div>
            </div>
          </li>
          <li class="needCon">
            <div class="display_box">
              <span>项目说明：</span>
              <p>{{ detailsInfo.introduction }}</p>
            </div>
          </li>
          <li class="rejectReason" v-if="isShowReject || detailsInfo.status === 3">
            <div class="display_box">
              <span>驳回原因：</span>
              <textarea v-model.trim="rejectReason" :readonly="detailsInfo.status === 3"></textarea>
            </div>
          </li>
          <li class="btn" v-if="detailsInfo.status === 4">
            <el-button v-if="isShowReject" @click="closeReject">取消</el-button>
            <el-button v-if="isShowReject" type="primary" @click="submitRejectReason">确定</el-button>
            <el-button v-if="!isShowReject" type="warning" @click="showReject">驳回</el-button>
            <el-button v-if="!isShowReject" type="primary" @click="showPopup('addProject')">添加至项目</el-button>
          </li>
        </ul>
      </div>

      <!-- 已立项 -->
      <div class="wrapper established" v-if="detailsInfo.status === 5">
        <ul>
          <li><p>已有项目: {{ detailsInfo.projects.length }}</p></li>
        </ul>
        <ul v-for="item in detailsInfo.projects">
          <li>
            <div class="display_box">
              <span>项目单号</span>
              <span>{{ item.projectId }}</span>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>项目名称</span>
              <span>{{ item.name }}</span>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>产品类型</span>
              <span>{{ item.productType }}</span>
            </div>
          </li>
          <li>
            <div class="display_box">
              <span>产品型号</span>
              <span>{{ item.productModel }}</span>
            </div>
          </li>
        </ul>
        <p class="btn">
          <el-button type="primary" @click="showPopup('addProject')">添加项目</el-button>
        </p>
      </div>

    </div>

    <!-- 派单弹窗 -->
    <div class="shadow" v-if="isShowPopup === 'dispatchShow'">
      <div class="wrapper">
        <div class="dispatch">
          <div>
            <label>销售姓名：</label>
            <el-select v-model.trim="dispatchData.sysUserId">
              <el-option label="全部" value=""></el-option>
              <el-option :label="item.name" :value="item.sysUserId" v-for="item in peopleDatas" :key="item.sysUserId"></el-option>
            </el-select>
          </div>
          <p>
            <el-button size="mini" @click="closePopup">取消</el-button>
            <el-button size="mini" type="primary" @click="confirmDispatch">确定</el-button>
          </p>
        </div>
      </div>
    </div>

    <!-- 添加项目弹窗 -->
    <div class="shadow" v-if="isShowPopup === 'addProject'">
      <div class="wrapper">
        <div class="addProject">
          <ul>
            <!--<li>-->
              <!--<span>项目单号：</span>-->
              <!--<input type="text">-->
            <!--</li>-->
            <li>
              <span>项目名称：</span>
              <input type="text" v-model="projectData.name">
            </li>
            <li>
              <span>产品类型：</span>
              <input type="text" v-model="projectData.productType">
            </li>
            <li>
              <span>产品型号：</span>
              <input type="text" v-model="projectData.productModel">
            </li>
          </ul>
          <p>
            <el-button size="mini" @click="closePopup">取消</el-button>
            <el-button size="mini" type="primary" @click="sbumitProject">确定</el-button>
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
          type: '',
          name: '',
          startTime: '',
          endTime: '',
          searchVaule: ''
        },
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        tableDatas: [],
        peopleDatas: [],
        isShowPopup: false,
        detailsInfo: {},
        dispatchData: {
          sysUserId: '',
          demandId: ''
        },
        rejectReason: '',
        isShowReject: false, // 是否显示驳回原因框框
        projectData: {
          name: '',
          productType: '',
          productModel: ''
        }
      }
    },
    created () {
      this.getPeople()
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取跟进人列表
      getPeople () {
        this.axios({
          method: 'GET',
          url: '/jingtian/sysuser/listForSales'
        }).then((result) => {
          if (result.data.code === 0) {
            this.peopleDatas = result.data.page.list
          }
        })
      },
      // 获取列表数据
      getDatas () {
        this.axios({
          method: 'POST',
          url: '/jingtian/demand/list',
          params: {
            status: this.form.state,
            type: this.form.type,
            name: this.form.name,
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
      // 关闭详情的页面
      isShowState (i) {
        this.isShow = i
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
            this.rejectReason = result.data.demand.rejectExplain
            this.isShow = 2
            this.dispatchData.demandId = id
          }
        })
      },
      // 显示弹窗
      showPopup (type) {
        if (type === 'dispatchPopup') {
          this.isShowPopup = 'dispatchShow'
        } else if (type === 'addProject') {
          this.isShowPopup = 'addProject'
        }
      },
      // 关闭弹出层
      closePopup () {
        this.isShowPopup = false
      },
      // 确定派单
      confirmDispatch () {
        this.axios({
          method: 'POST',
          url: '/jingtian/demand/send',
          data: this.toFormData({
            sysUserId: this.dispatchData.sysUserId,
            demandId: this.dispatchData.demandId
          })
        }).then(result => {
          if (result.data.code === 0) {
            this.closePopup()
            this.isShowState(1)
            this.$message.success('派单成功！')
            this.getDatas()
          }
        })
      },
      // 显示驳回原因
      showReject () {
        this.isShowReject = true
      },
      // 取消驳回原因
      closeReject () {
        this.isShowReject = false
      },
      // 提交驳回原因
      submitRejectReason () {
        this.axios({
          method: 'POST',
          url: '/jingtian/demand/reject',
          data: this.toFormData({
            demandId: this.dispatchData.demandId,
            rejectExplain: this.rejectReason
          })
        }).then(result => {
          if (result.data.code === 0) {
            this.$message.success('驳回提交成功！')
            this.isShow = 1
            this.getDatas()
          }
        })
      },
      // 提交至项目
      sbumitProject () {
        this.axios({
          method: 'POST',
          url: '/jingtian/project/save',
          data: this.toFormData({
            demandId: this.dispatchData.demandId,
            name: this.projectData.name,
            productType: this.projectData.productType,
            productModel: this.projectData.productModel
          })
        }).then(result => {
          if (result.data.code === 0) {
            this.$message.success('添加项目成功！')
            this.closePopup()
            this.isShowState(1)
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
          }
        }
        li.needCon, li.rejectReason{
          border: 0;
          .display_box{
            p, textarea{
              line-height: 20px;
              margin-top: 10px;
              padding: 3px 8px;
              width: 250px;
              min-height: 80px;
              max-height: 80px;
              border: 1px solid #c5c5c5;
              overflow: auto;
            }
          }
        }
        li.btn{
          text-align: center;
          border: 0;
          margin-top: 45px;
        }
      }
    }
    .established{
      ul{
        li{
          border: 1px solid #c5c5c5;
          border-bottom: 0;
          >.display_box{
            padding-left: 0px;
            text-align: center;
            span{
              width: 50%;
            }
          }
        }
        li:last-of-type{
          border-bottom: 1px solid #c5c5c5;
        }
      }
      ul:first-of-type{
        padding-bottom: 0;
        li{
          border: 0;
          border-bottom: 1px solid #c5c5c5;
          p{
            font-size: 18px;
            line-height: 40px;
          }
        }
      }
      >p{
        text-align: center;
        margin-top: 20px;
      }
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
      width: 400px;
      background: #fff;
      box-shadow: 0 0 5px rgba(255,255,255,0.5);
      border-radius: 5px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .dispatch{
        padding: 30px 50px;
        text-align: center;
        p{
          margin-top: 36px;
        }
      }
      .addProject{
        text-align: center;
        padding: 35px 50px 20px;
        ul li{
          height: 35px;
          line-height: 35px;
          text-align: center;
          margin-bottom: 20px;
          input{
            width: 200px;
            height: 100%;
            padding: 0 10px;
            border: 1px solid #c5c5c5;
          }
        }
        p{
          margin-top: 30px;
        }
      }
    }
  }
</style>

