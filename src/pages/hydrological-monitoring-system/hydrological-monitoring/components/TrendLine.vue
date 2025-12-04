<script setup lang="ts">
import * as echarts from "echarts"
import { onMounted, onUnmounted, ref, watch } from "vue"

const props = defineProps({
  data: {
    type: Array as () => number[],
    default: () => []
  },
  color: {
    type: String,
    default: "#409eff"
  }
})

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  setOption()

  window.addEventListener("resize", resizeChart)
}

function setOption() {
  if (!chartInstance) return

  const option: echarts.EChartsOption = {
    grid: {
      top: 5,
      bottom: 5,
      left: 5,
      right: 5
    },
    xAxis: {
      type: "category",
      show: false,
      boundaryGap: false
    },
    yAxis: {
      type: "value",
      show: false,
      min: value => Math.floor(value.min * 0.9),
      max: value => Math.ceil(value.max * 1.1)
    },
    series: [
      {
        data: props.data,
        type: "line",
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
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
          opacity: 0.2
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

function resizeChart() {
  chartInstance?.resize()
}

watch(() => props.data, () => {
  setOption()
}, { deep: true })

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  window.removeEventListener("resize", resizeChart)
  chartInstance?.dispose()
})
</script>

<template>
  <div ref="chartRef" class="trend-line" />
</template>

<style scoped>
.trend-line {
  width: 100%;
  height: 40px;
}
</style>
