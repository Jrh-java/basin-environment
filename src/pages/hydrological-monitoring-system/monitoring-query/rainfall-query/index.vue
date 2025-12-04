<script setup lang="ts">
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import { Refresh, Search } from "@element-plus/icons-vue"
import * as echarts from "echarts"
import { ElMessage } from "element-plus"
import { debounce } from "lodash-es"
import { onMounted, onUnmounted, reactive, ref } from "vue"

defineOptions({
  name: "RainfallQuery"
})

// 搜索表单
const searchForm = reactive({
  stationName: "",
  timeRange: [] as string[]
})

// 表格数据
const loading = ref(false)
const tableData = ref<any[]>([])
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 模拟数据生成
function generateData() {
  const data = []
  for (let i = 1; i <= 2; i++) {
    data.push({
      id: i,
      stationName: "洪山桥水位站",
      stationCode: "N250200001",
      time: "2025-02-01",
      region: "鼓楼区",
      source: "终端",
      intensity: "强",
      realTimeRainfall: "14mm",
      cumulativeRainfall: "12cm",
      conclusion: "强降雨"
    })
  }
  return data
}

// 初始化图表
function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
  window.addEventListener("resize", resizeChart)
}

// 更新图表数据
function updateChart() {
  if (!chartInstance) return

  const times = ["2025-01-20 14:00", "2025-01-20 16:00", "2025-01-20 18:00", "2025-01-20 20:00", "2025-01-20 22:00", "2025-01-20 24:00", "2025-01-20 02:00", "2025-01-20 04:00"]
  const values = [0, 0, 0.5, 1.5, 4.5, 8.2, 21.5, 22.5, 22.3, 11.5, 6.5, 0.2, 0]

  // 补全X轴数据以匹配values长度
  const extendedTimes = [
    "2025-01-20 14:00",
    "2025-01-20 16:00",
    "2025-01-20 18:00",
    "2025-01-20 20:00",
    "2025-01-20 22:00",
    "2025-01-20 24:00",
    "2025-01-20 02:00",
    "2025-01-20 04:00",
    "2025-01-20 06:00",
    "2025-01-20 08:00",
    "2025-01-20 10:00",
    "2025-01-20 12:00",
    "2025-01-20 14:00"
  ]

  const option: echarts.EChartsOption = {
    title: {
      text: "单位：m³/s", // 原图是流量单位，这里根据需求应该是雨量单位 mm，但为了匹配截图保持一致，或者更正为mm
      right: 10,
      top: 10,
      textStyle: {
        fontSize: 12,
        color: "#666"
      }
    },
    tooltip: {
      trigger: "axis"
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: extendedTimes,
      axisLabel: {
        color: "#999"
      },
      axisLine: {
        lineStyle: {
          color: "#eee"
        }
      }
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#eee"
        }
      }
    },
    series: [
      {
        name: "雨量",
        type: "line",
        smooth: true,
        symbol: "none",
        data: values,
        lineStyle: {
          color: "#FF0000",
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(255, 0, 0, 0.1)"
            },
            {
              offset: 1,
              color: "rgba(255, 0, 0, 0)"
            }
          ])
        }
      }
    ]
  }
  chartInstance.setOption(option)
}

function resizeChart() {
  chartInstance?.resize()
}

// 初始化数据
function initData() {
  loading.value = true
  setTimeout(() => {
    tableData.value = generateData()
    loading.value = false
  }, 500)
}

// 防抖查询
const handleSearch = debounce(() => {
  ElMessage.success("查询成功")
  initData()
  updateChart()
}, 300)

// 重置
function handleReset() {
  searchForm.stationName = ""
  searchForm.timeRange = []
  initData()
}

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 50,
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
  initChart()
})

onUnmounted(() => {
  window.removeEventListener("resize", resizeChart)
  chartInstance?.dispose()
})
</script>

<template>
  <SearchTableLayout>
    <template #searchSlot>
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="监测站点名称">
          <el-input v-model="searchForm.stationName" placeholder="请输入站点名称" clearable @input="handleSearch" />
        </el-form-item>
        <el-form-item label="监测时间段">
          <el-date-picker
            v-model="searchForm.timeRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleSearch"
          />
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
        <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
          <el-table-column prop="stationName" label="站点名称" min-width="120" align="center" />
          <el-table-column prop="stationCode" label="测站编码" min-width="100" align="center" />
          <el-table-column prop="time" label="监测时间" min-width="120" align="center" />
          <el-table-column prop="region" label="行政区划" min-width="100" align="center" />
          <el-table-column prop="source" label="数据来源" min-width="100" align="center" />
          <el-table-column prop="intensity" label="雨量强度" min-width="100" align="center" />
          <el-table-column prop="realTimeRainfall" label="实时雨量" min-width="100" align="center" />
          <el-table-column prop="cumulativeRainfall" label="累计降雨量" min-width="120" align="center" />
          <el-table-column prop="conclusion" label="测量结论" min-width="100" align="center" />
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

        <div class="chart-container">
          <div class="chart-title">
            | 雨量趋势分析
          </div>
          <div ref="chartRef" class="chart" />
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
.chart-container {
  margin-top: 20px;
  .chart-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 15px;
    border-left: 3px solid #333;
    padding-left: 10px;
  }
  .chart {
    width: 100%;
    height: 300px;
  }
}
</style>
