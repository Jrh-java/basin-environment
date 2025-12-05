<script setup lang="ts">
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import { DataLine, Refresh, Search, View } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import { onMounted, onUnmounted, reactive, ref } from "vue"
import TrendModal from "../components/TrendModal.vue"

defineOptions({
  name: "Rainfall"
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
const currentTrendColor = ref("")

// 雨量等级配置
function getRainfallLevel(val: number): { label: string, type: "success" | "primary" | "warning" | "danger" | "info", color: string } {
  if (val < 10) return { label: "小雨", type: "success", color: "#67C23A" }
  if (val < 25) return { label: "中雨", type: "primary", color: "#409EFF" }
  if (val < 50) return { label: "大雨", type: "warning", color: "#E6A23C" }
  return { label: "暴雨", type: "danger", color: "#F56C6C" }
}

// 模拟数据生成
function generateData() {
  const regions = ["鼓楼区", "台江区", "仓山区", "马尾区", "晋安区"]
  const data = []
  for (let i = 1; i <= 10; i++) {
    const realTimeRainfall = Number.parseFloat((Math.random() * 60).toFixed(1))
    const levelInfo = getRainfallLevel(realTimeRainfall)

    data.push({
      id: i,
      stationName: `雨量站${i.toString().padStart(2, "0")}`,
      stationCode: `RF${202400 + i}`,
      region: regions[i % 5],
      connectionStatus: Math.random() > 0.1 ? "online" : "offline",
      rainfallIntensity: levelInfo.label,
      realTimeRainfall,
      cumulativeRainfall: (realTimeRainfall * (1 + Math.random())).toFixed(1),
      status: "监测中",
      time: new Date().toLocaleString(),
      trendData: Array.from({ length: 10 }, () => Math.random() * 60)
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
      const newValue = Number.parseFloat((Math.random() * 60).toFixed(1))
      row.realTimeRainfall = newValue
      row.cumulativeRainfall = (Number.parseFloat(row.cumulativeRainfall) + newValue * 0.1).toFixed(1)
      row.rainfallIntensity = getRainfallLevel(newValue).label
      row.time = new Date().toLocaleString()
      row.trendData.shift()
      row.trendData.push(newValue)
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
  currentTrendTitle.value = `${row.stationName} - 降雨趋势`
  currentTrendColor.value = getRainfallLevel(row.realTimeRainfall).color
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
  <div class="rainfall-container">
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
            <el-table-column prop="rainfallIntensity" label="雨量强度" min-width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="getRainfallLevel(row.realTimeRainfall).type" effect="dark">
                  {{ row.rainfallIntensity }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="realTimeRainfall" label="实时雨量(mm)" min-width="120" align="center" sortable>
              <template #default="{ row }">
                <span :style="{ color: getRainfallLevel(row.realTimeRainfall).color, fontWeight: 'bold' }">
                  {{ row.realTimeRainfall }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="cumulativeRainfall" label="累计降雨量(mm)" min-width="140" align="center" />
            <el-table-column prop="status" label="状态" min-width="80" align="center" />
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
      :color="currentTrendColor"
    />
  </div>
</template>

<style scoped lang="scss">
.rainfall-container {
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
