<script setup lang="ts">
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import { Refresh, Search } from "@element-plus/icons-vue"
import { reactive, ref } from "vue"

defineOptions({ name: "EvaluationAnalysis" })

// 搜索表单
const searchForm = reactive({
  eventName: "",
  eventStatus: "",
  eventSource: "",
  timeRange: [],
  eventLevel: "",
  eventArea: []
})

// 模拟级联选择器数据
const areaOptions = [
  {
    value: "fuzhou",
    label: "福州市",
    children: [
      { value: "gulou", label: "鼓楼区" },
      { value: "taijiang", label: "台江区" },
      { value: "cangshan", label: "仓山区" },
      { value: "mawei", label: "马尾区" },
      { value: "jinan", label: "晋安区" }
    ]
  }
]

// 表格数据
const loading = ref(false)
const tableData = ref([
  {
    eventName: "河道垃圾堆积",
    eventCode: "EV20250203001",
    eventSource: "巡检发现",
    eventArea: "鼓楼区",
    status: "待处理",
    time: "2025-02-03 10:00",
    duration: "2小时",
    type: "水环境",
    level: "一般",
    reporter: "张三"
  },
  {
    eventName: "污水偷排",
    eventCode: "EV20250203002",
    eventSource: "群众举报",
    eventArea: "台江区",
    status: "处理中",
    time: "2025-02-03 09:30",
    duration: "2.5小时",
    type: "水污染",
    level: "紧急",
    reporter: "李四"
  },
  {
    eventName: "堤防破损",
    eventCode: "EV20250202005",
    eventSource: "监控报警",
    eventArea: "仓山区",
    status: "已结案",
    time: "2025-02-02 14:20",
    duration: "24小时",
    type: "水利设施",
    level: "重要",
    reporter: "系统自动"
  }
])

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 100
})

function handleSearch() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success("查询成功")
  }, 500)
}

function handleReset() {
  searchForm.eventName = ""
  searchForm.eventStatus = ""
  searchForm.eventSource = ""
  searchForm.timeRange = []
  searchForm.eventLevel = ""
  searchForm.eventArea = []
  handleSearch()
}

function handleSizeChange(val: number) {
  pagination.pageSize = val
  handleSearch()
}

function handleCurrentChange(val: number) {
  pagination.currentPage = val
  handleSearch()
}

function getStatusType(status: string) {
  switch (status) {
    case "待处理": return "danger"
    case "处理中": return "warning"
    case "已结案": return "success"
    default: return "info"
  }
}

// 查看
function handleView(row: any) {
  ElMessage.info(`查看事件：${row.eventName}`)
}
</script>

<template>
  <div class="evaluation-analysis-container">
    <SearchTableLayout>
      <template #searchSlot>
        <el-form :model="searchForm" :inline="true">
          <el-form-item label="事件名称">
            <el-input v-model="searchForm.eventName" placeholder="请输入事件名称" clearable />
          </el-form-item>
          <el-form-item label="事件状态">
            <el-select v-model="searchForm.eventStatus" placeholder="请选择" clearable style="width: 150px">
              <el-option label="待处理" value="pending" />
              <el-option label="处理中" value="processing" />
              <el-option label="已结案" value="closed" />
            </el-select>
          </el-form-item>
          <el-form-item label="事件来源">
            <el-select v-model="searchForm.eventSource" placeholder="请选择" clearable style="width: 150px">
              <el-option label="巡检发现" value="patrol" />
              <el-option label="群众举报" value="report" />
              <el-option label="监控报警" value="monitor" />
            </el-select>
          </el-form-item>
          <el-form-item label="监测时间段">
            <el-date-picker
              v-model="searchForm.timeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="事件等级">
            <el-select v-model="searchForm.eventLevel" placeholder="请选择" clearable style="width: 150px">
              <el-option label="一般" value="normal" />
              <el-option label="重要" value="important" />
              <el-option label="紧急" value="urgent" />
            </el-select>
          </el-form-item>
          <el-form-item label="事发区域">
            <el-cascader
              v-model="searchForm.eventArea"
              :options="areaOptions"
              placeholder="请选择区域"
              clearable
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">
              查询
            </el-button>
            <el-button :icon="Refresh" @click="handleReset">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </template>

      <template #tableSlot>
        <el-card shadow="never" class="table-card">
          <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
            <el-table-column prop="eventName" label="事件名称" min-width="150" align="center" show-overflow-tooltip />
            <el-table-column prop="eventCode" label="事件编号" min-width="140" align="center" />
            <el-table-column prop="eventSource" label="事件来源" min-width="100" align="center" />
            <el-table-column prop="eventArea" label="事发区域" min-width="100" align="center" />
            <el-table-column prop="status" label="处理状态" min-width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" effect="plain">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="事发时间" min-width="160" align="center" />
            <el-table-column prop="duration" label="处理时效" min-width="100" align="center" />
            <el-table-column prop="type" label="事件类型" min-width="100" align="center" />
            <el-table-column prop="level" label="事件等级" min-width="100" align="center">
              <template #default="{ row }">
                <el-tag
                  :type="row.level === '紧急' ? 'danger' : row.level === '重要' ? 'warning' : 'info'"
                  effect="dark"
                >
                  {{ row.level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reporter" label="上报人" min-width="100" align="center" />
            <el-table-column label="操作" width="100" align="center" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleView(row)">
                  查看
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
  </div>
</template>

<style scoped lang="scss">
.evaluation-analysis-container {
  height: 100%;
  display: flex;
  flex-direction: column;
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
