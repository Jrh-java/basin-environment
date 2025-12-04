<script setup lang="ts">
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import { Plus } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { reactive, ref } from "vue"

defineOptions({
  name: "WarningSettings"
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    warningType: "氨氮超标",
    warningLevel: "中等",
    description: "氨氮<1.2",
    params: "总磷、总氮",
    variation: "0.1",
    time: "2025-02-01 16:25:25",
    frequency: "每日两次",
    template: "1"
  },
  {
    id: 2,
    warningType: "氨氮超标",
    warningLevel: "中等",
    description: "氨氮<1.2",
    params: "总磷、总氮",
    variation: "0.1",
    time: "2025-02-01 16:25:25",
    frequency: "每日两次",
    template: "1"
  }
])

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 50,
  total: 2
})

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
  ElMessageBox.confirm("确认删除该预警规则吗？", "提示", {
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
      <div class="search-toolbar">
        <el-button type="primary" :icon="Plus" @click="handleAdd">
          新增+
        </el-button>
      </div>
    </template>

    <template #tableSlot>
      <el-card shadow="never" class="table-card">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="60" align="center">
            <template #default="scope">
              {{ (pagination.currentPage - 1) * pagination.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="warningType" label="预警类型" min-width="120" align="center" />
          <el-table-column prop="warningLevel" label="预警等级" min-width="100" align="center" />
          <el-table-column prop="description" label="规则描述" min-width="150" align="center" />
          <el-table-column prop="params" label="参数选取" min-width="150" align="center" />
          <el-table-column prop="variation" label="变动值 (+/-)" min-width="120" align="center" />
          <el-table-column prop="time" label="取值时间" min-width="180" align="center" />
          <el-table-column prop="frequency" label="取值频次" min-width="120" align="center" />
          <el-table-column prop="template" label="消息模板" min-width="100" align="center" />
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
.search-toolbar {
  display: flex;
  align-items: center;
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
