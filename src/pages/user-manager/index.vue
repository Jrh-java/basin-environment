<script setup lang="ts">
import type { UserData } from "./apis/type"
// import { ElMessage, ElMessageBox } from "element-plus"
import { onMounted, reactive, ref } from "vue"
import { deleteUserApi, getUserListApi } from "./apis"
import PasswordModal from "./components/PasswordModal.vue"
import UserModal from "./components/UserModal.vue"

const loading = ref(false)
const tableData = ref<UserData[]>([])
const total = ref(0)
const queryForm = reactive({
  current: 1,
  size: 10,
  username: "",
  realname: ""
})

const userModalRef = ref<InstanceType<typeof UserModal>>()
const passwordModalRef = ref<InstanceType<typeof PasswordModal>>()

function getTableData() {
  loading.value = true
  getUserListApi(queryForm)
    .then((res) => {
      tableData.value = res.result.records
      total.value = res.result.total
    })
    .finally(() => {
      loading.value = false
    })
}

function handleSearch() {
  queryForm.current = 1
  getTableData()
}

function handleReset() {
  queryForm.username = ""
  queryForm.realname = ""
  handleSearch()
}

function handleAdd() {
  userModalRef.value?.open()
}

function handleEdit(row: UserData) {
  userModalRef.value?.open(row)
}

function handleDelete(row: UserData) {
  ElMessageBox.confirm("确认删除该用户吗？", "提示", {
    type: "warning"
  }).then(() => {
    deleteUserApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}

function handleChangePassword(row: UserData) {
  passwordModalRef.value?.open(row)
}

function handleCurrentChange(val: number) {
  queryForm.current = val
  getTableData()
}

function handleSizeChange(val: number) {
  queryForm.size = val
  getTableData()
}

onMounted(() => {
  getTableData()
})
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form :inline="true" :model="queryForm">
        <el-form-item label="用户名">
          <el-input v-model="queryForm.username" placeholder="请输入用户名" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="queryForm.realname" placeholder="请输入真实姓名" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            查询
          </el-button>
          <el-button @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd">
          新增用户
        </el-button>
      </div>

      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="realname" label="真实姓名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="userIdentity" label="身份">
          <template #default="{ row }">
            <el-tag v-if="row.userIdentity === 1">
              普通用户
            </el-tag>
            <el-tag v-else-if="row.userIdentity === 2" type="success">
              上级
            </el-tag>
            <span v-else>{{ row.userIdentity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button link type="primary" @click="handleChangePassword(row)">
              修改密码
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryForm.current"
          v-model:page-size="queryForm.size"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <UserModal ref="userModalRef" @success="getTableData" />
    <PasswordModal ref="passwordModalRef" @success="getTableData" />
  </div>
</template>

<style scoped lang="scss">
.app-container {
  padding: 20px;
}
.search-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}
.table-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  .table-header {
    margin-bottom: 20px;
  }
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
