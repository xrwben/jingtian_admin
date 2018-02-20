// 用户状态
const accountState = function (value) {
  var result
  switch (value) {
    case 1:
      result = '在职'
      break
    case 2:
      result = '离职'
      break
    default:
      break
  }
  return result
}

// 用户类型
const accountType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '超级管理员'
      break
    case 2:
      result = '主管'
      break
    case 3:
      result = '销售'
      break
    default:
      break
  }
  return result
}

// 需求单状态
const needsFormState = function (value) {
  var result
  switch (value) {
    case 1:
      result = '未分配'
      break
    case 2:
      result = '已分配'
      break
    case 3:
      result = '已驳回'
      break
    case 4:
      result = '已处理'
      break
    case 5:
      result = '已立项'
      break
    default:
      break
  }
  return result
}

// 需求单状态
const needsFormType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '安全'
      break
    case 2:
      result = '优化'
      break
    case 3:
      result = '运维管理'
      break
    case 4:
      result = '容灾备份'
      break
    case 5:
      result = '虚拟化&云计算'
      break
    case 6:
      result = '超融合'
      break
    case 7:
      result = '容器云'
      break
    case 8:
      result = '软件定制'
      break
    default:
      break
  }
  return result
}

// 项目状态
const projectState = function (value) {
  var result
  switch (value) {
    case 1:
      result = '待成交'
      break
    case 2:
      result = '已成交'
      break
    case 3:
      result = '已关闭'
      break
    default:
      break
  }
  return result
}

// 供应商状态
const supplierState = function (value) {
  var result
  switch (value) {
    case 1:
      result = '未审核'
      break
    case 2:
      result = '已审核'
      break
    default:
      break
  }
  return result
}

// 日期格式
const dateFormat = function (value) {
  if (value) {
    let year = new Date(value).getFullYear() || 0
    let month = (new Date(value).getMonth() + 1 || 0) < 10 ? '0' + (new Date(value).getMonth() + 1 || 0) : (new Date(value).getMonth() + 1 || 0)
    let date = (new Date(value).getDate() || 0) < 10 ? '0' + (new Date(value).getDate() || 0) : (new Date(value).getDate() || 0)
    return year + '-' + month + '-' + date
  } else {
    return '--'
  }
}

// 时间格式
const tiemFormat = function (value) {
  if (value) {
    let year = new Date(value).getFullYear() || 0
    let month = (new Date(value).getMonth() + 1 || 0) < 10 ? '0' + (new Date(value).getMonth() + 1 || 0) : (new Date(value).getMonth() + 1 || 0)
    let date = (new Date(value).getDate() || 0) < 10 ? '0' + (new Date(value).getDate() || 0) : (new Date(value).getDate() || 0)
    let hour = (new Date(value).getHours() || 0) < 10 ? '0' + (new Date(value).getHours() || 0) : (new Date(value).getHours() || 0)
    let minute = (new Date(value).getMinutes() || 0) < 10 ? '0' + (new Date(value).getMinutes() || 0) : (new Date(value).getMinutes() || 0)
    let second = (new Date(value).getSeconds() || 0) < 10 ? '0' + (new Date(value).getSeconds() || 0) : (new Date(value).getSeconds() || 0)
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
  } else {
    return '--'
  }
}

export {accountState, accountType, needsFormState, needsFormType, projectState, supplierState, dateFormat, tiemFormat}
