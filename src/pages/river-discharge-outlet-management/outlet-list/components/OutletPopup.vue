<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from "vue"
import * as echarts from "echarts"
import { Close, Location } from "@element-plus/icons-vue"

const props = defineProps<{
  visible: boolean
  data: any
}>()

const emit = defineEmits(["close"])

const flowChartRef = ref<HTMLElement | null>(null)
const codChartRef = ref<HTMLElement | null>(null)
let flowChart: echarts.ECharts | null = null
let codChart: echarts.ECharts | null = null

const initCharts = () => {
  if (flowChartRef.value) {
    flowChart = echarts.init(flowChartRef.value)
    flowChart.setOption({
      title: { text: '监测流量', left: 'center', textStyle: { color: '#fff', fontSize: 14 } },
      grid: { top: 30, bottom: 20, left: 30, right: 10 },
      xAxis: {
        type: 'category',
        data: ['06:00', '09:00', '12:00', '15:00', '18:00'],
        axisLabel: { color: '#fff' },
        axisLine: { lineStyle: { color: '#fff' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#fff' },
        splitLine: { show: false }
      },
      series: [{
        data: [7, 9, 7.5, 8, 7.8],
        type: 'line',
        smooth: true,
        lineStyle: { color: '#00ffff' }
      }]
    })
  }

  if (codChartRef.value) {
    codChart = echarts.init(codChartRef.value)
    codChart.setOption({
      title: { text: 'COD', left: 'center', textStyle: { color: '#fff', fontSize: 14 } },
      grid: { top: 30, bottom: 20, left: 30, right: 10 },
      xAxis: {
        type: 'category',
        data: ['06:00', '09:00', '12:00', '15:00', '18:00'],
        axisLabel: { color: '#fff' },
        axisLine: { lineStyle: { color: '#fff' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#fff' },
        splitLine: { show: false }
      },
      series: [{
        data: [15, 20, 18, 22, 19],
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.3 },
        lineStyle: { color: '#fff' }
      }]
    })
  }
}

watch(() => props.visible, (val) => {
  if (val) {
    nextTick(() => {
      initCharts()
    })
  } else {
    flowChart?.dispose()
    codChart?.dispose()
  }
})

const handleClose = () => {
  emit("close")
}

onUnmounted(() => {
  flowChart?.dispose()
  codChart?.dispose()
})
</script>

<template>
  <div v-if="visible" class="popup-container">
    <div class="popup-header">
      <div class="title">
        <el-icon class="location-icon"><Location /></el-icon>
        <span>{{ data?.name || '排污口' }}</span>
      </div>
      <el-icon class="close-icon" @click="handleClose"><Close /></el-icon>
    </div>
    <div class="popup-content">
      <div class="section-title">基础信息</div>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">设施编码</span>
          <span class="value">{{ data?.code || 'DEV20240115' }}</span>
        </div>
        <div class="info-item">
          <span class="label">设施类型</span>
          <span class="value">{{ data?.type || '排污口' }}</span>
        </div>
        <div class="info-item">
          <span class="label">管材</span>
          <span class="value">{{ data?.material || '聚乙烯' }}</span>
        </div>
        <div class="info-item">
          <span class="label">管底标高</span>
          <span class="value">{{ data?.elevation || '14mm' }}</span>
        </div>
        <div class="info-item full-width">
          <span class="label">附属设备</span>
          <span class="value">{{ data?.equipment || '水质检测仪、温度计' }}</span>
        </div>
        <div class="info-item full-width">
          <span class="label">设施地址</span>
          <span class="value">{{ data?.address || '鼓楼区西河公园' }}</span>
        </div>
        <div class="info-item">
          <span class="label">流域水体</span>
          <span class="value">{{ data?.waterBody || '西河' }}</span>
        </div>
         <div class="info-item">
          <span class="label">行政区划</span>
          <span class="value">{{ data?.region || '鼓楼区' }}</span>
        </div>
      </div>
      
      <div class="image-container">
        <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" alt="现场图1" />
        <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" alt="现场图2" />
      </div>

      <div class="section-title">监测信息</div>
      <div class="charts-container">
        <div ref="flowChartRef" class="chart"></div>
        <div ref="codChartRef" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.popup-container {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 400px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 4px;
  z-index: 1000;
  backdrop-filter: blur(4px);
  max-height: 90vh;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;
  }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  .title {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    
    .location-icon {
      margin-right: 5px;
      color: #409eff;
    }
  }

  .close-icon {
    cursor: pointer;
    font-size: 20px;
    &:hover {
      color: #409eff;
    }
  }
}

.popup-content {
  padding: 15px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  padding-left: 8px;
  border-left: 3px solid #409eff;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;

  .info-item {
    font-size: 12px;
    display: flex;
    
    &.full-width {
      grid-column: span 2;
    }

    .label {
      color: #bbb;
      margin-right: 8px;
      white-space: nowrap;
    }
    .value {
      color: #fff;
      word-break: break-all;
    }
  }
}

.image-container {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  
  img {
    width: calc(50% - 5px);
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
  }
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .chart {
    width: 100%;
    height: 150px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
}
</style>
