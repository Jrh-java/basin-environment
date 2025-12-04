<script setup lang="ts">
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import { Refresh, Search } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { reactive, ref } from "vue"

defineOptions({
  name: "WarningPublish"
})

// 搜索表单数据
const searchForm = reactive({
  warningType: "",
  publishTime: [],
  publishStatus: "",
  warningLevel: ""
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    warningType: "氨氮超标",
    warningLevel: "中等",
    details: "氨氮≥1.2",
    publishTime: "2025-02-01 16:45:51",
    status: "已发布",
    result: "已对超标点进行排查"
  },
  {
    id: 2,
    warningType: "氨氮超标",
    warningLevel: "中等",
    details: "氨氮≥1.2",
    publishTime: "2025-02-01 16:45:51",
    status: "已发布",
    result: "已对超标点进行排查"
  },
  {
    id: 3,
    warningType: "氨氮超标",
    warningLevel: "中等",
    details: "氨氮≥1.2",
    publishTime: "2025-02-01 16:45:51",
    status: "已发布",
    result: "已对超标点进行排查"
  },
  {
    id: 4,
    warningType: "氨氮超标",
    warningLevel: "中等",
    details: "氨氮≥1.2",
    publishTime: "2025-02-01 16:45:51",
    status: "已发布",
    result: "已对超标点进行排查"
  },
  {
    id: 5,
    warningType: "氨氮超标",
    warningLevel: "中等",
    details: "氨氮≥1.2",
    publishTime: "2025-02-01 16:45:51",
    status: "已发布",
    result: "已对超标点进行排查"
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
  searchForm.publishTime = []
  searchForm.publishStatus = ""
  searchForm.warningLevel = ""
}

// 分页
function handleSizeChange(val: number) {
  pagination.pageSize = val
}
function handleCurrentChange(val: number) {
  pagination.currentPage = val
}

// 处理预警
function handleProcess(row: any) {
  ElMessageBox.prompt("请输入处理结果", "预警处理", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /\S+/,
    inputErrorMessage: "处理结果不能为空"
  }).then(({ value }) => {
    row.result = value
    ElMessage.success(`处理成功: ${value}`)
  }).catch(() => {
    // 取消处理
  })
}
</script>

<template>
  <SearchTableLayout>
    <template #searchSlot>
      <el-form :model="searchForm" label-width="80px" :inline="true">
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="searchForm.publishTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="预警类型">
          <el-select v-model="searchForm.warningType" placeholder="请选择" clearable style="width: 180px">
            <el-option label="氨氮超标" value="氨氮超标" />
            <el-option label="河道口有污水" value="河道口有污水" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警程度">
          <el-select v-model="searchForm.warningLevel" placeholder="请选择" clearable style="width: 180px">
            <el-option label="中等" value="中等" />
            <el-option label="严重" value="严重" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select v-model="searchForm.publishStatus" placeholder="请选择" clearable style="width: 180px">
            <el-option label="已发布" value="已发布" />
            <el-option label="未发布" value="未发布" />
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
      <el-card shadow="never" class="table-card">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="60" align="center">
            <template #default="scope">
              {{ (pagination.currentPage - 1) * pagination.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="warningType" label="预警类型" min-width="120" align="center" />
          <el-table-column prop="warningLevel" label="预警程度" min-width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.warningLevel === '严重' ? 'danger' : 'warning'">
                {{ row.warningLevel }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="details" label="预警详情" min-width="150" align="center" />
          <el-table-column prop="publishTime" label="发布时间" min-width="180" align="center" sortable />
          <el-table-column prop="status" label="发布状态" min-width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === '已发布' ? 'success' : 'info'">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="result" label="处理结果" min-width="180" align="center" show-overflow-tooltip />
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleProcess(row)">
                处理
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
