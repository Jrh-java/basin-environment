<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from "vue"
import * as Cesium from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"
import { ElMessage } from "element-plus"
import {
  Aim,
  Connection,
  TrendCharts,
  DataLine,
  Histogram
} from "@element-plus/icons-vue"

defineOptions({ name: "MonitoringAnalysis" })

const viewerContainer = ref<HTMLElement | null>(null)
const viewer = shallowRef<Cesium.Viewer | null>(null)

const activeTool = ref("")

const tools = [
  { key: "flow", name: "流向分析", icon: Aim },
  { key: "slope", name: "坡度分析", icon: TrendCharts },
  { key: "connectivity", name: "连通性分析", icon: Connection },
  { key: "crossSection", name: "横截面分析", icon: DataLine },
  { key: "longitudinalSection", name: "纵截面分析", icon: Histogram }
]

onMounted(() => {
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

    // 添加一些模拟实体
    addSampleEntities()
  }
})

onUnmounted(() => {
  if (viewer.value) {
    viewer.value.destroy()
    viewer.value = null
  }
})

const addSampleEntities = () => {
    if (!viewer.value) return
    
    // 模拟河流路径
    viewer.value.entities.add({
        name: "模拟河流",
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([
                119.25, 26.08,
                119.26, 26.07,
                119.28, 26.06,
                119.30, 26.05
            ]),
            width: 5,
            material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.BLUE)
        }
    })

    // 模拟监测点
    viewer.value.entities.add({
        position: Cesium.Cartesian3.fromDegrees(119.27, 26.065),
        point: {
            pixelSize: 10,
            color: Cesium.Color.RED
        },
        label: {
            text: "监测点A",
            font: "18px sans-serif",
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.8),
            showBackground: true,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -15)
        }
    })

    viewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(119.27, 26.065, 10000)
    })
}

const handleToolClick = (key: string) => {
  activeTool.value = key
  ElMessage.success(`已激活${tools.find(t => t.key === key)?.name}功能`)
  
  // 这里可以添加具体的分析逻辑
  switch(key) {
      case 'flow':
          // 执行流向分析逻辑
          break;
      case 'slope':
          // 执行坡度分析逻辑
          break;
      // ... 其他分析功能
  }
}
</script>

<template>
  <div class="monitoring-analysis-container">
    <div ref="viewerContainer" class="cesium-container"></div>
    
    <!-- 分析工具栏 -->
    <div class="analysis-toolbar">
      <div class="toolbar-title">空间分析工具</div>
      <div class="tools-grid">
        <div 
          v-for="tool in tools" 
          :key="tool.key"
          class="tool-item"
          :class="{ active: activeTool === tool.key }"
          @click="handleToolClick(tool.key)"
        >
          <el-icon :size="24" class="tool-icon">
            <component :is="tool.icon" />
          </el-icon>
          <span class="tool-name">{{ tool.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.monitoring-analysis-container {
  width: 100%;
  height: 100%; // 需要父容器有高度
  min-height: 85vh; // 或者设置最小高度
  position: relative;
  overflow: hidden;
}

.cesium-container {
  width: 100%;
  height: 100%;
}

.analysis-toolbar {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 200px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
  z-index: 100;

  .toolbar-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }

  .tools-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .tool-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    color: #606266;

    &:hover {
      background-color: #f5f7fa;
      color: #409eff;
    }

    &.active {
      background-color: #ecf5ff;
      color: #409eff;
    }

    .tool-icon {
      margin-right: 10px;
    }

    .tool-name {
      font-size: 14px;
    }
  }
}
</style>
