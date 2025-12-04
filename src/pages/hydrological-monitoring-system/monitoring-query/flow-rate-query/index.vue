<script setup lang="ts">
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import { Refresh, Search } from "@element-plus/icons-vue"
import * as echarts from "echarts"
import { ElMessage } from "element-plus"
import { debounce } from "lodash-es"
import { onMounted, onUnmounted, reactive, ref } from "vue"

defineOptions({
  name: "FlowRateQuery"
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
      monitorFlow: 13.5,
      flowSpeed: 0.8,
      totalFlow: 25413.4,
      conclusion: "正常"
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
  const values = [7.8, 8.2, 10.5, 13.5, 15.5, 12.2, 9.5, 7.8]

  const option: echarts.EChartsOption = {
    title: {
      text: "单位：m³/s",
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
      data: times,
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
      min: 0,
      max: 20,
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#eee"
        }
      }
    },
    series: [
      {
        name: "流量",
        type: "line",
        smooth: true,
        symbol: "none",
        data: values,
        lineStyle: {
          color: "#999",
          width: 1
        },
        markLine: {
          symbol: "none",
          label: {
            position: "start",
            formatter: "{b}"
          },
          data: [
            {
              yAxis: 2,
              name: "流量下限",
              lineStyle: {
                color: "#E6A23C", // 橙色警告
                type: "solid",
                width: 1
              }
            },
            {
              yAxis: 12,
              name: "流量上限",
              lineStyle: {
                color: "#E6A23C", // 橙色警告
                type: "solid",
                width: 1
              }
            }
          ]
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
          <el-table-column prop="monitorFlow" label="监测流量(m³/s)" min-width="120" align="center" />
          <el-table-column prop="flowSpeed" label="流速(m/s)" min-width="100" align="center" />
          <el-table-column prop="totalFlow" label="今日累计流量(m³)" min-width="150" align="center" />
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
            | 流量趋势分析
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
