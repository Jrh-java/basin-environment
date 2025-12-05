<script setup lang="ts">
import * as echarts from "echarts"
import { computed, nextTick, ref, watch } from "vue"

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array as () => number[],
    default: () => []
  },
  title: {
    type: String,
    default: "趋势分析"
  },
  loading: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: "#409eff"
  }
})

const emit = defineEmits(["update:visible", "close"])

const dialogVisible = computed({
  get: () => props.visible,
  set: val => emit("update:visible", val)
})

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return

  // 如果实例已存在，先销毁
  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value)
  setOption()
}

function setOption() {
  if (!chartInstance) return

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
      formatter: "{b}: {c}"
    },
    grid: {
      top: 40,
      right: 20,
      bottom: 30,
      left: 40,
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: props.data.map((_, index) => `T${index + 1}`), // 生成简单的时序标签
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: "#909399"
        }
      }
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#E4E7ED"
        }
      }
    },
    series: [
      {
        data: props.data,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          color: props.color
        },
        lineStyle: {
          width: 3,
          color: props.color
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: props.color
            },
            {
              offset: 1,
              color: "rgba(255, 255, 255, 0)"
            }
          ]),
          opacity: 0.3
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

function handleClose() {
  dialogVisible.value = false
  emit("close")
}

function handleOpened() {
  nextTick(() => {
    initChart()
    window.addEventListener("resize", resizeChart)
  })
}

function handleClosed() {
  window.removeEventListener("resize", resizeChart)
  chartInstance?.dispose()
  chartInstance = null
}

function resizeChart() {
  chartInstance?.resize()
}

// 监听数据变化更新图表
watch(() => props.data, () => {
  if (dialogVisible.value && chartInstance) {
    setOption()
  }
}, { deep: true })
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="60%"
    align-center
    destroy-on-close
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    @opened="handleOpened"
    @closed="handleClosed"
    class="trend-modal"
  >
    <div v-loading="loading" class="chart-container">
      <div ref="chartRef" class="chart-content" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.chart-container {
  height: 400px;
  width: 100%;
  position: relative;
}

.chart-content {
  width: 100%;
  height: 100%;
}
</style>
