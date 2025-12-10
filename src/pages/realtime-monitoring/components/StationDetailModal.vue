<script setup lang="ts">
import type { WaterGroupHourItem, WaterStationMonitoringRow } from "@/http/water/water-station-monitoring"
import dayjs from "dayjs"
import * as echarts from "echarts"
import { computed, nextTick, onUnmounted, ref, watch } from "vue"
import { getWaterGroupHour } from "@/http/water/water-station-monitoring"

import { columns } from "../WaterStationMonitoring.data"

const props = defineProps<{ modelValue: boolean, row: WaterStationMonitoringRow | null }>()
const emit = defineEmits<{ (e: "update:modelValue", v: boolean): void }>()
const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v)
})

const loading = ref(false)
const items = ref<WaterGroupHourItem[]>([])

const colors = ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C", "#909399", "#9A60B4", "#2F4554"]
const seriesKeys = [
  "dissolvedOxygenMgL",
  "phValue",
  "waterTemperature",
  "ammoniaNitrogenMgL",
  "permanganate",
  "phosphorus"
] as const
const labelMap: Record<string, string> = Object.fromEntries(
  columns
    .filter(c => (seriesKeys as readonly string[]).includes(c.prop))
    .map(c => [c.prop, c.label])
)

async function fetchGroupHour() {
  if (!props.row) return
  const stationId = props.row.stationId ?? props.row.stationCode
  if (stationId === undefined) return
  loading.value = true
  try {
    const res = await getWaterGroupHour(stationId as any)
    items.value = [...(res.result || [])].sort((a, b) => {
      return new Date(a.monitoringTime).getTime() - new Date(b.monitoringTime).getTime()
    })
  } catch (error: any) {
    const fallback = error?.response?.data?.result
    if (Array.isArray(fallback)) {
      items.value = [...fallback].sort((a, b) => {
        return new Date(a.monitoringTime).getTime() - new Date(b.monitoringTime).getTime()
      })
    } else {
      items.value = []
    }
  } finally {
    loading.value = false
  }
}

watch(visible, (v) => {
  if (v) fetchGroupHour()
})

function close() {
  emit("update:modelValue", false)
}

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

function alpha(hex: string, a: number) {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex)
  if (!m) return hex
  const r = Number.parseInt(m[1], 16)
  const g = Number.parseInt(m[2], 16)
  const b = Number.parseInt(m[3], 16)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

function buildOption(): echarts.EChartsOption {
  const xData = items.value.map((i) => {
    const t = i.monitoringTime
    return dayjs(t).isValid() ? dayjs(t).format("MM-DD HH:mm") : String(t ?? "")
  })
  const series: echarts.LineSeriesOption[] = (seriesKeys as readonly string[]).map((k, idx) => {
    const color = colors[idx % colors.length]
    const data = items.value.map((i) => {
      const v = i[k as keyof WaterGroupHourItem] as number | undefined
      return typeof v === "number" ? v : null
    })
    return {
      name: labelMap[k] || k,
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: { color, width: 2 },
      showSymbol: false,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: alpha(color, 0.35) },
          { offset: 1, color: alpha(color, 0.05) }
        ])
      },
      data
    } as echarts.LineSeriesOption
  })
  return {
    grid: { left: 40, right: 16, top: 56, bottom: 40, containLabel: true },
    tooltip: { trigger: "axis" },
    legend: { top: 8, left: "center", icon: "rect", itemWidth: 18, itemHeight: 8, data: series.map(s => String(s.name)) },
    xAxis: { type: "category", boundaryGap: false, data: xData, axisLabel: { color: "#909399" } },
    yAxis: { type: "value", axisLabel: { color: "#909399" }, splitLine: { lineStyle: { color: "#ebeef5" } } },
    series
  }
}

function initChart() {
  if (chartRef.value && !chart) {
    chart = echarts.init(chartRef.value)
    window.addEventListener("resize", handleResize)
  }
}

function handleResize() {
  chart && chart.resize()
}

function disposeChart() {
  if (chart) {
    chart.dispose()
    chart = null
    window.removeEventListener("resize", handleResize)
  }
}

function renderChart() {
  if (!chart) return
  chart.setOption(buildOption(), true)
}

watch(visible, async (v) => {
  if (v) {
    await fetchGroupHour()
    await nextTick()
    initChart()
    renderChart()
  } else {
    disposeChart()
  }
})

watch(items, () => {
  renderChart()
})

onUnmounted(() => {
  disposeChart()
})
</script>

<template>
  <el-dialog v-model="visible" title="站点详情" width="800px" :close-on-click-modal="false">
    <div v-if="row" class="detail" v-loading="loading">
      <div class="meta">
        <div>站点名称：{{ row.stationName }}</div>
        <div>测站编码：{{ row.stationCode }}</div>
      </div>
      <div class="chart-wrapper">
        <div ref="chartRef" class="chart-echarts" />
      </div>
    </div>
    <template #footer>
      <el-button @click="close">
        关闭
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.chart-wrapper {
  width: 100%;
}
.chart-echarts {
  width: 100%;
  height: 320px;
}
</style>
