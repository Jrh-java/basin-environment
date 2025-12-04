<script setup lang="ts">
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import { Plus, Refresh, Search } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { reactive, ref } from "vue"

defineOptions({
  name: "WarningPush"
})

// 搜索表单数据
const searchForm = reactive({
  warningType: "",
  warningLevel: "",
  status: "",
  publishMode: ""
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    warningType: "氨氮超标",
    warningLevel: "中等",
    startTime: "2025-02-01 16:25:25",
    endTime: "2025-02-01 16:25:25",
    method: "短信",
    receiver: "管理组",
    status: "已启用",
    publishMode: "自动"
  },
  {
    id: 2,
    warningType: "氨氮超标",
    warningLevel: "中等",
    startTime: "2025-02-01 16:25:25",
    endTime: "2025-02-01 16:25:25",
    method: "短信",
    receiver: "管理组",
    status: "已启用",
    publishMode: "自动"
  },
  {
    id: 3,
    warningType: "氨氮超标",
    warningLevel: "中等",
    startTime: "2025-02-01 16:25:25",
    endTime: "2025-02-01 16:25:25",
    method: "站内",
    receiver: "管理组",
    status: "已启用",
    publishMode: "自动"
  },
  {
    id: 4,
    warningType: "氨氮超标",
    warningLevel: "中等",
    startTime: "2025-02-01 16:25:25",
    endTime: "2025-02-01 16:25:25",
    method: "站内",
    receiver: "管理组",
    status: "已启用",
    publishMode: "自动"
  },
  {
    id: 5,
    warningType: "氨氮超标",
    warningLevel: "中等",
    startTime: "2025-02-01 16:25:25",
    endTime: "2025-02-01 16:25:25",
    method: "短信",
    receiver: "管理组",
    status: "已启用",
    publishMode: "自动"
  },
  {
    id: 6,
    warningType: "氨氮超标",
    warningLevel: "中等",
    startTime: "2025-02-01 16:25:25",
    endTime: "2025-02-01 16:25:25",
    method: "邮件",
    receiver: "管理组",
    status: "已启用",
    publishMode: "自动"
  }
])

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 50,
  total: 8
})

// 搜索
function handleSearch() {
  console.log("Search with:", searchForm)
}

// 重置
function handleReset() {
  searchForm.warningType = ""
  searchForm.warningLevel = ""
  searchForm.status = ""
  searchForm.publishMode = ""
}

// 新增
function handleAdd() {
  ElMessage.info("点击了新增按钮")
}

// 编辑
function handleEdit(row: any) {
  ElMessage.info(`点击了编辑: ${row.id}`)
}

// 删除
function handleDelete(row: any) {
  ElMessageBox.confirm("确认删除该预警推送配置吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    ElMessage.success("删除成功")
  }).catch(() => {})
}

// 分页
function handleSizeChange(val: number) {
  pagination.pageSize = val
}
function handleCurrentChange(val: number) {
  pagination.currentPage = val
}
</script>

<template>
  <SearchTableLayout>
    <template #searchSlot>
      <el-form :model="searchForm" label-width="80px" :inline="true">
        <el-form-item label="预警类型">
          <el-input v-model="searchForm.warningType" placeholder="水质; 水位; 流量" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="预警程度">
          <el-select v-model="searchForm.warningLevel" placeholder="一级; 二级; 三级" clearable style="width: 180px">
            <el-option label="一级" value="一级" />
            <el-option label="二级" value="二级" />
            <el-option label="三级" value="三级" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态">
          <el-select v-model="searchForm.status" placeholder="启用; 停用" clearable style="width: 180px">
            <el-option label="启用" value="启用" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布方式">
          <el-select v-model="searchForm.publishMode" placeholder="自动; 手动" clearable style="width: 180px">
            <el-option label="自动" value="自动" />
            <el-option label="手动" value="手动" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            查询
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">
            清空
          </el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #tableSlot>
      <div class="toolbar">
        <el-button type="primary" :icon="Plus" @click="handleAdd">
          新增+
        </el-button>
      </div>
      <el-card shadow="never" class="table-card">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="60" align="center">
            <template #default="scope">
              {{ (pagination.currentPage - 1) * pagination.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="warningType" label="预警类型" min-width="120" align="center" />
          <el-table-column prop="warningLevel" label="预警程度" min-width="100" align="center" />
          <el-table-column prop="startTime" label="开始时间" min-width="180" align="center" />
          <el-table-column prop="endTime" label="结束时间" min-width="180" align="center" />
          <el-table-column prop="method" label="预警方式" min-width="100" align="center" />
          <el-table-column prop="receiver" label="接收对象" min-width="120" align="center" />
          <el-table-column prop="status" label="启用状态" min-width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === '已启用' ? 'success' : 'info'">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="publishMode" label="发布方式" min-width="100" align="center" />
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button type="danger" link @click="handleDelete(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </template>
  </SearchTableLayout>
</template>

<style scoped lang="scss">
.toolbar {
  margin-bottom: 16px;
}

.table-card {
  border: none;
  :deep(.el-card__body) {
    padding: 0;
  }
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
</style>
