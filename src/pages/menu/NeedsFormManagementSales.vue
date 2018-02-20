<template>
  <div id="NeedsFormManagement">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName">
          <el-tab-pane label="未处理需求单" name="UntreatedNeedsForm">
            <untreated-needs-form v-if="activeName === 'UntreatedNeedsForm'"></untreated-needs-form>
          </el-tab-pane>
          <el-tab-pane label="已处理需求单" name="TreatedNeedsForm">
            <treated-needs-form v-if="activeName === 'TreatedNeedsForm'"></treated-needs-form>
          </el-tab-pane>
          <el-tab-pane label="已驳回需求单" name="RejectedNeedsForm">
            <rejected-needs-form v-if="activeName === 'RejectedNeedsForm'"></rejected-needs-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import UntreatedNeedsForm from '../../components/needsFormManagementSales/UntreatedNeedsForm.vue'
  import TreatedNeedsForm from '../../components/needsFormManagementSales/TreatedNeedsForm.vue'
  import RejectedNeedsForm from '../../components/needsFormManagementSales/RejectedNeedsForm.vue'
  export default{
    data () {
      return {
        activeName: 'UntreatedNeedsForm'
      }
    },
    components: {
      UntreatedNeedsForm,
      TreatedNeedsForm,
      RejectedNeedsForm
    }
  }
</script>

<style>

</style>
