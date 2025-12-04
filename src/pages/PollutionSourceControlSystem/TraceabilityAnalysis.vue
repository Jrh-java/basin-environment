<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, shallowRef } from "vue"
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import * as echarts from "echarts"
import * as Cesium from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"
import { ElMessage } from "element-plus"

defineOptions({ name: "TraceabilityAnalysis" })

// 查询表单
const searchForm = reactive({
  sourceName: "",
  envType: ""
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    sourceName: "西河排污口01",
    envType: "工厂",
    manageProp: "市管",
    productInfo: "中等",
    warningInfo: "氨氮≥1.2",
    location: "鼓楼区东大河西侧300m"
  },
  {
    id: 2,
    sourceName: "西河排污口02",
    envType: "生活污水",
    manageProp: "区管",
    productInfo: "中等",
    warningInfo: "氨氮≥1.2",
    location: "鼓楼区东大河西侧300m"
  },
  {
    id: 3,
    sourceName: "西河排污口03",
    envType: "医院",
    manageProp: "区管",
    productInfo: "中等",
    warningInfo: "氨氮≥1.2",
    location: "鼓楼区东大河西侧300m"
  },
  {
    id: 4,
    sourceName: "西河排污口04",
    envType: "工厂",
    manageProp: "乡镇",
    productInfo: "中等",
    warningInfo: "氨氮≥1.2",
    location: "鼓楼区东大河西侧300m"
  }
])

const loading = ref(false)
const pagination = reactive({
  currentPage: 1,
  pageSize: 50,
  total: 0
})

// 图表引用
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 地图引用
const viewerContainer = ref<HTMLElement | null>(null)
const viewer = shallowRef<Cesium.Viewer | null>(null)

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['环比分析', '同比分析'],
      top: 10,
      left: 100
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['2025-01-20 14:00', '2025-01-20 16:00', '2025-01-20 18:00', '2025-01-20 20:00', '2025-01-20 22:00', '2025-01-20 24:00', '2025-01-20 02:00', '2025-01-20 04:00'],
      axisLabel: {
        color: '#999'
      },
      axisLine: {
        lineStyle: {
          color: '#eee'
        }
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 20,
      interval: 5,
      axisLabel: {
        color: '#999'
      },
      splitLine: {
        lineStyle: {
          color: '#eee'
        }
      }
    },
    series: [
      {
        name: '环比分析',
        type: 'line',
        data: [13, 13, 13, 13, 13, 13, 13, 13],
        itemStyle: {
            color: '#ff7f50'
        },
        markLine: {
            data: [{ yAxis: 13, name: '环比线' }],
            lineStyle: {
                color: '#ff7f50'
            },
            symbol: 'none',
            label: {
                show: true,
                position: 'middle',
                formatter: '环比分析'
            }
        }
      },
      {
        name: '同比分析',
        type: 'line',
        smooth: true,
        data: [7, 12, 9, 10, 9, 10, 9, 9],
        itemStyle: {
            color: '#32cd32'
        },
        markLine: {
            data: [{ yAxis: 9.5, name: '同比线' }],
            lineStyle: {
                color: '#32cd32'
            },
            symbol: 'none',
            label: {
                show: true,
                position: 'middle',
                formatter: '同比分析'
            }
        }
      }
    ]
  }
  
  chartInstance.setOption(option)
}

// 初始化地图
const initMap = () => {
  if (viewerContainer.value) {
    viewer.value = new Cesium.Viewer(viewerContainer.value, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      vrButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      creditContainer: document.createElement("div"),
    })
    
    // 添加模拟溯源路径
    const positions = Cesium.Cartesian3.fromDegreesArray([
        119.27, 26.08,
        119.28, 26.07,
        119.29, 26.06
    ])
    
    viewer.value.entities.add({
        name: "污染溯源路径",
        polyline: {
            positions: positions,
            width: 5,
            material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.RED
            })
        }
    })

    viewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(119.28, 26.07, 10000)
    })
  }
}

// 窗口大小变化时重绘
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  initMap()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  if (viewer.value) {
    viewer.value.destroy()
    viewer.value = null
  }
})

// 查询
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success("查询成功")
  }, 500)
}

// 清空
const handleReset = () => {
  searchForm.sourceName = ""
  searchForm.envType = ""
  handleSearch()
}

// 分页
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  handleSearch()
}
const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  handleSearch()
}

// 污染日历按钮
const handleCalendar = () => {
    ElMessage.info("点击了污染日历")
}
</script>

<template>
  <div class="traceability-analysis-container">
    <SearchTableLayout>
      <template #searchSlot>
        <div class="search-wrapper">
            <el-form :model="searchForm" :inline="true" class="search-form">
            <el-form-item label="污染源名称">
                <el-input v-model="searchForm.sourceName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="环境类型">
                <el-input v-model="searchForm.envType" placeholder="请输入" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="handleReset">清空</el-button>
            </el-form-item>
            </el-form>
            <div class="right-actions">
                <el-button type="primary" @click="handleCalendar">污染日历</el-button>
            </div>
        </div>
      </template>

      <template #tableSlot>
        <div class="table-wrapper">
          <el-table
            :data="tableData"
            v-loading="loading"
            style="width: 100%"
            :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
          >
            <el-table-column prop="sourceName" label="污染源名称" min-width="150" />
            <el-table-column prop="envType" label="环境类型" min-width="120" align="center" />
            <el-table-column prop="manageProp" label="管理属性" min-width="120" align="center" />
            <el-table-column prop="productInfo" label="产品信息" min-width="120" align="center" />
            <el-table-column prop="warningInfo" label="预警信息" min-width="150" align="center" />
            <el-table-column prop="location" label="污染源位置" min-width="200" align="center" />
          </el-table>
          
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="pagination.currentPage"
              v-model:page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </template>
    </SearchTableLayout>

    <!-- 底部区域 -->
    <div class="bottom-section">
      <!-- 左侧图表 -->
      <div class="chart-panel">
        <div class="section-header">
          <span class="section-title">| 污染对比分析</span>
          <span class="unit">单位：m</span>
        </div>
        <div class="chart-container">
            <div ref="chartRef" class="chart"></div>
        </div>
      </div>
      
      <!-- 右侧地图 -->
      <div class="map-panel">
        <div class="section-header">
          <span class="section-title">| 溯源路径可视化</span>
        </div>
        <div class="map-container">
           <div ref="viewerContainer" class="cesium-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.traceability-analysis-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  overflow: auto;
}

.search-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: 20px;
  }
}

.table-wrapper {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}

.pagination-container {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.bottom-section {
  margin: 16px 24px;
  flex: 1;
  min-height: 400px;
  display: flex;
  gap: 20px;
}

.chart-panel, .map-panel {
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  
  .section-header {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      border-left: 4px solid #333;
      padding-left: 8px;
    }

    .unit {
        font-size: 14px;
        color: #666;
    }
  }
}

.chart-container, .map-container {
    flex: 1;
    position: relative;
}

.chart, .cesium-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
