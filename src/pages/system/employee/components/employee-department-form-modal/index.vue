<!--
  * 部门 员工 弹窗
  *
  * @Author:    1024创新实验室-主任：卓大
  * @Date:      2022-08-08 20:46:18
  * @Wechat:    zhuda1024
  * @Email:     lab1024@163.com
  * @Copyright  1024创新实验室 （ https://1024lab.net ），Since 2012
-->
<script setup>
import { ElMessage } from "element-plus"
import { isEmpty } from "lodash-es"
import { ref } from "vue"
import DepartmentTree from "../department-tree/index.vue"
import { employeeApi } from "/@/api/system/employee-api"
import { SmartLoading } from "/@/components/framework/smart-loading"
import { smartSentry } from "/@/lib/smart-sentry"

// ----------------------- 以下是字段定义 emits props ---------------------

const emit = defineEmits(["refresh"])

// ----------------------- 显示/隐藏 ------------------------

const departmentTree = ref()
const visible = ref(false)
const employeeIdList = ref([])

// 显示
async function showModal(selectEmployeeId) {
  employeeIdList.value = selectEmployeeId
  visible.value = true
}

// 隐藏
function closeModal() {
  visible.value = false
}

// ----------------------- form操作 ---------------------------------
async function handleOk() {
  SmartLoading.show()
  try {
    if (isEmpty(employeeIdList.value)) {
      ElMessage.warning("请选择要调整的员工")
      return
    }
    if (isEmpty(departmentTree.value.selectedKeys)) {
      ElMessage.warning("请选择要调整的部门")
      return
    }
    const departmentId = departmentTree.value.selectedKeys[0]
    const params = {
      employeeIdList: employeeIdList.value,
      departmentId
    }
    await employeeApi.batchUpdateDepartmentEmployee(params)
    ElMessage.success("操作成功")
    emit("refresh")
    closeModal()
  } catch (error) {
    smartSentry.captureError(error)
  } finally {
    SmartLoading.hide()
  }
}

// ----------------------- 以下是暴露的方法内容 ----------------------------
defineExpose({
  showModal
})
</script>

<template>
  <el-dialog v-model="visible" title="调整部门" width="500px" :lock-scroll="false" destroy-on-close>
    <DepartmentTree ref="departmentTree" :height="400" :show-menu="false" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeModal">
          取消
        </el-button>
        <el-button type="primary" @click="handleOk">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
  .dialog-footer {
  text-align: right;
}
</style>
