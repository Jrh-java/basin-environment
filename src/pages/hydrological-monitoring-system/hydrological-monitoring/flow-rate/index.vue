<script setup lang="ts">
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import { DataLine, Refresh, Right, Search, View } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import { onMounted, onUnmounted, reactive, ref } from "vue"
import TrendModal from "../components/TrendModal.vue"

defineOptions({
  name: "FlowRate"
})

// 搜索表单
const searchForm = reactive({
  stationName: "",
  region: "",
  status: ""
})

// 表格数据
const loading = ref(false)
const tableData = ref<any[]>([])

// 趋势弹窗状态
const trendModalVisible = ref(false)
const currentTrendData = ref<number[]>([])
const currentTrendTitle = ref("")

// 模拟数据生成
function generateData() {
  const regions = ["鼓楼区", "台江区", "仓山区", "马尾区", "晋安区"]
  const data = []
  for (let i = 1; i <= 10; i++) {
    const flowSpeed = Number.parseFloat((0.5 + Math.random() * 2).toFixed(2))
    data.push({
      id: i,
      stationName: `水文站${i.toString().padStart(2, "0")}`,
      stationCode: `FR${202400 + i}`,
      region: regions[i % 5],
      connectionStatus: Math.random() > 0.1 ? "online" : "offline",
      realTimeFlow: (10 + Math.random() * 20).toFixed(1),
      flowSpeed,
      flowDirection: Math.random() > 0.5 ? "down" : "up", // down: 顺流, up: 逆流/涨潮
      dailyTotalFlow: (10000 + Math.random() * 50000).toFixed(1),
      status: "监测中",
      time: new Date().toLocaleString(),
      trendData: Array.from({ length: 10 }, () => 10 + Math.random() * 20)
    })
  }
  return data
}

// 初始化数据
function initData() {
  loading.value = true
  setTimeout(() => {
    tableData.value = generateData()
    loading.value = false
  }, 500)
}

// 定时刷新
let timer: any = null
function startRefresh() {
  timer = setInterval(() => {
    tableData.value.forEach((row) => {
      const newFlow = Number.parseFloat((10 + Math.random() * 20).toFixed(1))
      row.realTimeFlow = newFlow.toFixed(1)
      row.flowSpeed = Number.parseFloat((0.5 + Math.random() * 2).toFixed(2))
      row.dailyTotalFlow = (Number.parseFloat(row.dailyTotalFlow) + newFlow * 0.1).toFixed(1)
      row.time = new Date().toLocaleString()
      row.trendData.shift()
      row.trendData.push(newFlow)
    })
  }, 5000)
}

// 搜索
function handleSearch() {
  ElMessage.success("查询成功")
  initData()
}

// 重置
function handleReset() {
  searchForm.stationName = ""
  searchForm.region = ""
  searchForm.status = ""
  initData()
}

// 查看详情
function handleView(row: any) {
  ElMessage.info(`查看站点详情: ${row.stationName}`)
}

// 处理行点击/趋势查看
function handleRowClick(row: any) {
  currentTrendData.value = row.trendData
  currentTrendTitle.value = `${row.stationName} - 流量趋势`
  trendModalVisible.value = true
}

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 100
})
function handleSizeChange(val: number) {
  pagination.pageSize = val
  initData()
}
function handleCurrentChange(val: number) {
  pagination.currentPage = val
  initData()
}

onMounted(() => {
  initData()
  startRefresh()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="flow-rate-container">
    <SearchTableLayout>
      <template #searchSlot>
        <el-form :model="searchForm" :inline="true">
          <el-form-item label="站点名称">
            <el-input v-model="searchForm.stationName" placeholder="请输入站点名称" clearable />
          </el-form-item>
          <el-form-item label="行政区划">
            <el-select v-model="searchForm.region" placeholder="请选择" clearable style="width: 150px">
              <el-option label="鼓楼区" value="鼓楼区" />
              <el-option label="台江区" value="台江区" />
            </el-select>
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
          <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            border
            @row-click="handleRowClick"
          >
            <el-table-column prop="stationName" label="站点名称" min-width="120" align="center" fixed />
            <el-table-column prop="stationCode" label="测站编码" min-width="100" align="center" />
            <el-table-column prop="region" label="行政区划" min-width="100" align="center" />
            <el-table-column prop="connectionStatus" label="联网状态" min-width="90" align="center">
              <template #default="{ row }">
                <el-tag :type="row.connectionStatus === 'online' ? 'success' : 'info'" effect="plain">
                  {{ row.connectionStatus === 'online' ? '在线' : '离线' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="realTimeFlow" label="实时流量(m³/s)" min-width="140" align="center" sortable>
              <template #default="{ row }">
                <span class="flow-value">{{ row.realTimeFlow }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="flowSpeed" label="流速(m/s)" min-width="120" align="center">
              <template #default="{ row }">
                <div class="flow-speed">
                  <span>{{ row.flowSpeed }}</span>
                  <el-icon
                    class="flow-arrow"
                    :class="row.flowDirection"
                    :color="row.flowDirection === 'down' ? '#67C23A' : '#F56C6C'"
                  >
                    <Right />
                  </el-icon>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="dailyTotalFlow" label="今日总流量(m³)" min-width="150" align="center" />
            <el-table-column prop="time" label="监测时间" min-width="160" align="center" />
            <el-table-column label="操作" width="150" align="center" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link :icon="View" @click.stop="handleView(row)">
                  查看
                </el-button>
                <el-button type="primary" link :icon="DataLine" @click.stop="handleRowClick(row)">
                  趋势
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

    <TrendModal
      v-model:visible="trendModalVisible"
      :data="currentTrendData"
      :title="currentTrendTitle"
      color="#409eff"
    />
  </div>
</template>

<style scoped lang="scss">
.flow-rate-container {
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
.flow-value {
  color: var(--el-color-primary);
  font-weight: bold;
}
.flow-speed {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.flow-arrow {
  transition: transform 0.3s;
  &.up {
    transform: rotate(-45deg);
  }
  &.down {
    transform: rotate(45deg);
  }
}
</style>

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
.flow-value {
  color: var(--el-color-primary);
  font-weight: bold;
}
.flow-speed {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.flow-arrow {
  font-weight: bold;
  transition: transform 0.3s;

  &.down {
    transform: rotate(90deg);
  }
  &.up {
    transform: rotate(-90deg);
  }
}
</style>
