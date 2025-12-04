<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from "vue"
import * as echarts from "echarts"
import { Document } from "@element-plus/icons-vue"

defineOptions({ name: "QueryStats" })

// 图表容器引用
const disposalPieChartRef = ref<HTMLElement | null>(null)
const eventTypePieChartRef = ref<HTMLElement | null>(null)
const timeBarChartRef = ref<HTMLElement | null>(null)

// 图表实例
let disposalPieChart: echarts.ECharts | null = null
let eventTypePieChart: echarts.ECharts | null = null
let timeBarChart: echarts.ECharts | null = null

// 模拟数据
const disposalStats = {
  daily: 325,
  temporary: 38
}

// 初始化图表
const initCharts = () => {
  // 1. 上方：事件处置情况饼图
  if (disposalPieChartRef.value) {
    disposalPieChart = echarts.init(disposalPieChartRef.value)
    disposalPieChart.setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '0%',
        left: 'center',
        icon: 'circle'
      },
      series: [
        {
          name: '事件处置情况',
          type: 'pie',
          radius: ['55%', '75%'], // 调整半径适配高度
          center: ['50%', '45%'], // 稍微上移，留出底部图例空间
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: disposalStats.daily, name: '日常工单', itemStyle: { color: '#2db7f5' } },
            { value: disposalStats.temporary, name: '临时工单', itemStyle: { color: '#f5c242' } }
          ]
        }
      ]
    })
  }

  // 2. 下方左侧：事件类型分析饼图
  if (eventTypePieChartRef.value) {
    eventTypePieChart = echarts.init(eventTypePieChartRef.value)
    eventTypePieChart.setOption({
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '事件类型分析',
          type: 'pie',
          radius: ['40%', '70%'], // 改为镂空饼图（环形图）
          data: [
            { value: 30, name: '建筑污水' },
            { value: 25, name: '垃圾堆放' },
            { value: 20, name: '生活污水' },
            { value: 15, name: '工业污水' },
            { value: 10, name: '其他污水' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
           label: {
             show: true,
             formatter: '{b}' // 显示名称
           }
        }
      ]
    })
  }

  // 3. 下方右侧：时间区间统计柱状图
  if (timeBarChartRef.value) {
    timeBarChart = echarts.init(timeBarChartRef.value)
    timeBarChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'], // 模拟月份或时间段
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '工单数量',
          type: 'bar',
          barWidth: '40%',
          data: [25, 42, 35, 38, 45, 35, 38, 35, 38, 38],
          itemStyle: {
            color: '#0095ff'
          }
        }
      ]
    })
  }
}

// 窗口大小变化时重绘图表
const resizeCharts = () => {
  disposalPieChart?.resize()
  eventTypePieChart?.resize()
  timeBarChart?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', resizeCharts)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCharts)
  disposalPieChart?.dispose()
  eventTypePieChart?.dispose()
  timeBarChart?.dispose()
})
</script>

<template>
  <div class="query-stats-container">
    <div class="section-header">
      <span class="section-title">| 综合统计分析</span>
    </div>

    <!-- 上部分：事件处置情况 -->
    <div class="top-section">
      <div class="chart-title">事件处置情况</div>
      <div class="top-content">
        <div class="chart-wrapper">
          <div ref="disposalPieChartRef" class="chart"></div>
        </div>
        <div class="stats-wrapper">
          <div class="stat-item">
            <el-icon class="stat-icon" :size="24" color="#409EFF"><Document /></el-icon>
            <span class="stat-label">日常工单：</span>
            <span class="stat-value">{{ disposalStats.daily }}</span>
          </div>
          <div class="stat-item">
            <el-icon class="stat-icon" :size="24" color="#909399"><Document /></el-icon>
            <span class="stat-label">临时工单：</span>
            <span class="stat-value">{{ disposalStats.temporary }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 下部分：事件类型分析 & 时间区间统计 -->
    <div class="bottom-section">
      <!-- 左侧：事件类型分析 -->
      <div class="bottom-left">
        <div class="chart-title">事件类型分析</div>
        <div ref="eventTypePieChartRef" class="chart"></div>
      </div>
      
      <!-- 右侧：时间区间统计 -->
      <div class="bottom-right">
        <div class="chart-title">时间区间统计</div>
        <div ref="timeBarChartRef" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.query-stats-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-header {
  margin-bottom: 10px;
  .section-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    border-left: 4px solid #333;
    padding-left: 8px;
  }
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

// 上部分样式
.top-section {
  background: #fff;
  border-radius: 4px;
  padding: 15px 20px; // 减小内边距
  
  .top-content {
    display: flex;
    align-items: center;
    height: 200px; // 减小高度
  }

  .chart-wrapper {
    flex: 0 0 40%;
    height: 100%;
    .chart {
      width: 100%;
      height: 100%;
    }
  }

  .stats-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 25px; // 减小间距
    padding-left: 50px;

    .stat-item {
      display: flex;
      align-items: center;
      font-size: 16px;
      
      .stat-icon {
        margin-right: 15px;
      }
      
      .stat-label {
        color: #606266;
        margin-right: 10px;
      }
      
      .stat-value {
        font-size: 20px;
        font-weight: bold;
        color: #303133;
      }
    }
  }
}

// 下部分样式
.bottom-section {
  display: flex;
  gap: 20px;
  height: 400px; // 固定高度，或者根据内容自适应

  .bottom-left {
    flex: 0 0 35%; // 左侧占 35%
    background: #fff;
    border-radius: 4px;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .bottom-right {
    flex: 1; // 右侧占剩余空间
    background: #fff;
    border-radius: 4px;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .chart {
    flex: 1;
    width: 100%;
    min-height: 0; // 允许 flex 子项收缩
  }
}
</style>
