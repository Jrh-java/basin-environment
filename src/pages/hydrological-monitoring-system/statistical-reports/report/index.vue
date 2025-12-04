<script setup lang="ts">
import * as echarts from "echarts"
import { nextTick, onMounted, onUnmounted, ref } from "vue"

defineOptions({
  name: "StatisticalReport"
})

// 图表 DOM 引用
const waterPieRef = ref<HTMLElement | null>(null)
const rainfallPieRef = ref<HTMLElement | null>(null)
const flowBarRef = ref<HTMLElement | null>(null)
const analysisLineRef = ref<HTMLElement | null>(null)

// 图表实例
let waterPieChart: echarts.ECharts | null = null
let rainfallPieChart: echarts.ECharts | null = null
let flowBarChart: echarts.ECharts | null = null
let analysisLineChart: echarts.ECharts | null = null

// 数据类型选择
const dataType = ref("water") // water, rainfall, flow

// 模拟数据
const mockData = {
  water: {
    pie: [
      { value: 1048, name: "≥1.0m/s" },
      { value: 735, name: "≥3.0m/s" },
      { value: 580, name: "<3.0m/s" }
    ],
    line: {
      yoy: [12, 11, 10, 9, 11, 13, 8, 10, 12, 11, 12, 13],
      mom: [18, 16, 13, 14, 16, 15, 11, 14, 15, 18, 19, 20],
      current: [8, 12, 14, 13, 10, 9, 11, 13, 15, 14, 15, 16]
    }
  },
  rainfall: {
    pie: [
      { value: 400, name: "小雨" },
      { value: 300, name: "中雨" },
      { value: 300, name: "大雨" },
      { value: 200, name: "暴雨" }
    ],
    line: {
      yoy: [20, 22, 25, 30, 35, 40, 35, 30, 25, 20, 15, 10],
      mom: [15, 18, 22, 28, 32, 38, 32, 28, 22, 18, 15, 12],
      current: [25, 28, 32, 38, 42, 48, 42, 38, 32, 28, 25, 20]
    }
  },
  flow: {
    bar: [120, 200, 150, 80, 70, 110, 130],
    line: {
      yoy: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105],
      mom: [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
      current: [60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115]
    }
  }
}

// 初始化饼图
function initPieChart(dom: HTMLElement | null, title: string, data: any[]) {
  if (!dom) return null
  const chart = echarts.init(dom)
  const option: echarts.EChartsOption = {
    title: {
      text: `| ${title}`,
      textStyle: {
        fontSize: 14,
        fontWeight: "bold"
      },
      left: 10,
      top: 10
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      top: "middle",
      right: "5%",
      orient: "vertical"
    },
    series: [
      {
        name: title,
        type: "pie",
        radius: ["40%", "70%"],
        center: ["40%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2
        },
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        },
        data
      }
    ]
  }
  chart.setOption(option)
  return chart
}

// 初始化柱状图
function initBarChart(dom: HTMLElement | null, title: string, data: number[]) {
  if (!dom) return null
  const chart = echarts.init(dom)
  const option: echarts.EChartsOption = {
    title: {
      text: `| ${title}`,
      textStyle: {
        fontSize: 14,
        fontWeight: "bold"
      },
      left: 10,
      top: 10
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: title,
        type: "bar",
        barWidth: "40%",
        data,
        itemStyle: {
          color: "#409EFF",
          borderRadius: [5, 5, 0, 0]
        }
      }
    ]
  }
  chart.setOption(option)
  return chart
}

// 初始化折线图
function initLineChart(dom: HTMLElement | null) {
  if (!dom) return null
  const chart = echarts.init(dom)
  updateLineChart(chart)
  return chart
}

// 更新折线图数据
function updateLineChart(chart: echarts.ECharts | null) {
  if (!chart) return

  const data = mockData[dataType.value as keyof typeof mockData].line
  const times = ["2025-01-20 14:00", "2025-01-20 16:00", "2025-01-20 18:00", "2025-01-20 20:00", "2025-01-20 22:00", "2025-01-20 24:00", "2025-01-20 02:00", "2025-01-20 04:00", "2025-01-20 06:00", "2025-01-20 08:00", "2025-01-20 10:00", "2025-01-20 12:00"]

  const option: echarts.EChartsOption = {
    title: {
      text: "| 统计分析",
      textStyle: {
        fontSize: 14,
        fontWeight: "bold"
      },
      left: 10,
      top: 10
    },
    tooltip: {
      trigger: "axis"
    },
    legend: {
      data: ["同比", "环比", "当期"],
      top: 10,
      left: 120
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
      axisLine: {
        lineStyle: {
          color: "#999"
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
        name: "同比",
        type: "line",
        smooth: true,
        data: data.yoy,
        itemStyle: { color: "#E6A23C" }
      },
      {
        name: "环比",
        type: "line",
        smooth: true,
        data: data.mom,
        itemStyle: { color: "#67C23A" }
      },
      {
        name: "当期",
        type: "line",
        smooth: true,
        data: data.current,
        itemStyle: { color: "#909399" }
      }
    ]
  }
  chart.setOption(option)
}

// 处理类型切换
function handleTypeChange() {
  updateLineChart(analysisLineChart)
}

// 响应式调整
function resizeCharts() {
  waterPieChart?.resize()
  rainfallPieChart?.resize()
  flowBarChart?.resize()
  analysisLineChart?.resize()
}

onMounted(async () => {
  await nextTick()

  waterPieChart = initPieChart(waterPieRef.value, "水情统计", mockData.water.pie)
  rainfallPieChart = initPieChart(rainfallPieRef.value, "雨情统计", mockData.rainfall.pie)
  flowBarChart = initBarChart(flowBarRef.value, "流量统计", mockData.flow.bar)
  analysisLineChart = initLineChart(analysisLineRef.value)

  window.addEventListener("resize", resizeCharts)
})

onUnmounted(() => {
  window.removeEventListener("resize", resizeCharts)
  waterPieChart?.dispose()
  rainfallPieChart?.dispose()
  flowBarChart?.dispose()
  analysisLineChart?.dispose()
})
</script>

<template>
  <div class="report-container">
    <!-- 上半部分：三个统计图表 -->
    <div class="top-charts">
      <el-card shadow="hover" class="chart-card">
        <div ref="waterPieRef" class="chart" />
      </el-card>
      <el-card shadow="hover" class="chart-card">
        <div ref="rainfallPieRef" class="chart" />
      </el-card>
      <el-card shadow="hover" class="chart-card">
        <div ref="flowBarRef" class="chart" />
      </el-card>
    </div>

    <!-- 下半部分：统计分析折线图 -->
    <div class="bottom-chart">
      <el-card shadow="hover" class="analysis-card">
        <div class="chart-header">
          <div class="type-select">
            <el-radio-group v-model="dataType" @change="handleTypeChange">
              <el-radio label="water">
                水情
              </el-radio>
              <el-radio label="rainfall">
                雨情
              </el-radio>
              <el-radio label="flow">
                流量
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div ref="analysisLineRef" class="chart big-chart" />
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.report-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.top-charts {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;

  .chart-card {
    flex: 1;
    height: 300px;
    border-radius: 8px;

    :deep(.el-card__body) {
      padding: 0;
      height: 100%;
    }

    .chart {
      width: 100%;
      height: 100%;
    }
  }
}

.bottom-chart {
  .analysis-card {
    border-radius: 8px;
    position: relative;

    :deep(.el-card__body) {
      padding: 20px;
    }

    .chart-header {
      position: absolute;
      top: 20px;
      right: 30px;
      z-index: 10;
    }

    .big-chart {
      width: 100%;
      height: 400px;
    }
  }
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .top-charts {
    flex-direction: column;

    .chart-card {
      height: 250px;
    }
  }
}
</style>
