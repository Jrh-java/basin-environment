<script lang="ts" setup>
import * as Cesium from "cesium"
import { ElMessage } from "element-plus"
import { onBeforeUnmount, onMounted, ref } from "vue"
import { addInverseMask } from "@/common/utils/cesium-mask"
import { getWaterStationList } from "@/http/water/water-station"
import SmartPopup from "./components/SmartPopup.vue"

defineOptions({ name: "Dashboard" })

const loading = ref(false)
const viewerRef = ref<Cesium.Viewer | null>(null)
const containerId = "cesiumContainer"
const popup = ref<{ lon: number, lat: number, title: string, content: string } | null>(null)

function parseLatLong(latLong?: string): { lon: number, lat: number } | null {
  if (!latLong) return null
  const parts = latLong.split(",")
  if (parts.length !== 2) return null
  const lon = Number(parts[0])
  const lat = Number(parts[1])
  if (Number.isNaN(lon) || Number.isNaN(lat)) return null
  return { lon, lat }
}

async function initMap() {
  ;(window as any).CESIUM_BASE_URL = "/cesium"
  const v = new Cesium.Viewer(containerId, {
    animation: false,
    timeline: false,
    fullscreenButton: false,
    infoBox: false,
    homeButton: false,
    geocoder: false,
    sceneModePicker: false,
    selectionIndicator: false,
    baseLayerPicker: false,
    navigationHelpButton: false
  })
  ;(v.cesiumWidget.creditContainer as any).style.display = "none"
  try {

  } catch {}
  viewerRef.value = v

  // 加载遮罩并定位
  try {
    await addInverseMask(v, "/area.geojson", {
      flyTo: true,
      maskColor: Cesium.Color.BLUE.withAlpha(0.9),
      lineColor: Cesium.Color.fromCssColorString("#6dcdeb"),
      lineWidth: 2
    })
  } catch (e: any) {
    console.error(e)
    ElMessage.error("区域遮罩加载失败")
  }
}

async function renderStations() {
  if (!viewerRef.value) return
  try {
    const res = await getWaterStationList({})
    const list = Array.isArray(res.result) ? res.result : []
    list.forEach((s) => {
      const p = parseLatLong(s.latLong)
      if (!p) return
      const entity = viewerRef.value!.entities.add({
        name: s.stationName,
        position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, 50),
        point: {
          pixelSize: 10,
          color: Cesium.Color.fromCssColorString("#409EFF"),
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND // 贴地
        },
        label: {
          text: s.stationName,
          font: "18px sans-serif",
          fillColor: Cesium.Color.WHITE,
          // outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -30),
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND // 贴地
        },
        description: `站点名称：${s.stationName}<br/>站点代码：${s.stationCode}<br/>经纬度：${s.latLong}<br/>行政区划：${s.administrativeRegion ?? ""}`
      })
      // 记录经纬度在 entity.properties 以便点击获取
      entity.properties = new Cesium.PropertyBag({
        lon: p.lon,
        lat: p.lat,
        title: s.stationName,
        content: `站点名称：${s.stationName}<br/>站点代码：${s.stationCode}<br/>经纬度：${s.latLong}<br/>行政区划：${s.administrativeRegion ?? ""}`
      })
    })
    // 选择实体变化时展示弹窗
    viewerRef.value.selectedEntityChanged.addEventListener((entity) => {
      if (!entity || !entity.properties) {
        popup.value = null
        return
      }
      const lon = entity.properties?.lon?.getValue?.() ?? entity.properties?.lon
      const lat = entity.properties?.lat?.getValue?.() ?? entity.properties?.lat
      const title = entity.properties?.title?.getValue?.() ?? entity.properties?.title
      const content = entity.properties?.content?.getValue?.() ?? entity.properties?.content
      if (typeof lon === "number" && typeof lat === "number") {
        popup.value = { lon, lat, title: String(title ?? ""), content: String(content ?? "") }
      }
    })
  } catch (err: any) {
    ElMessage.error(err?.message || "站点加载失败")
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await initMap()
    await renderStations()
  } catch (err: any) {
    ElMessage.error(err?.message || "地图初始化失败")
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  viewerRef.value?.destroy()
  viewerRef.value = null
})
</script>

<template>
  <div class="dashboard-page" v-loading="loading">
    <div :id="containerId" class="map-container" />
    <SmartPopup
      v-if="popup && viewerRef"
      :viewer="viewerRef!"
      :title="popup.title"
      :content="popup.content"
      :longitude="popup.lon"
      :latitude="popup.lat"
      @close="popup = null"
    />
  </div>
</template>

<style lang="scss" scoped>
.dashboard-page {
  height: 100%;
  width: 100%;
  display: flex;
}
.map-container {
  flex: 1;
  height: 100%;
  position: relative;
}
</style>
