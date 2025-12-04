<script setup lang="ts">
import { onMounted, ref, shallowRef, onUnmounted } from "vue"
import * as Cesium from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"
import OutletPopup from "./components/OutletPopup.vue"

defineOptions({ name: "OutletList" })

const viewerContainer = ref<HTMLElement | null>(null)
const viewer = shallowRef<Cesium.Viewer | null>(null)
const showPopup = ref(false)
const popupData = ref<any>({})

onMounted(() => {
  if (viewerContainer.value) {
    // Initialize Cesium Viewer
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
      creditContainer: document.createElement("div"), // Hide credits
    })

    // Add some sample entities
    addMarkers()
    
    // Add click handler
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.value.scene.canvas)
    handler.setInputAction((movement: any) => {
      const pickedObject = viewer.value?.scene.pick(movement.position)
      if (Cesium.defined(pickedObject) && pickedObject.id) {
        // Show popup
        const entity = pickedObject.id
        popupData.value = {
            name: entity.name,
            code: entity.properties?.code?.getValue(),
            type: entity.properties?.type?.getValue(),
            material: entity.properties?.material?.getValue(),
            elevation: entity.properties?.elevation?.getValue(),
            equipment: entity.properties?.equipment?.getValue(),
            address: entity.properties?.address?.getValue(),
            waterBody: entity.properties?.waterBody?.getValue(),
            region: entity.properties?.region?.getValue(),
        }
        showPopup.value = true
      } else {
        showPopup.value = false
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
})

onUnmounted(() => {
    if (viewer.value) {
        viewer.value.destroy()
        viewer.value = null
    }
})

const addMarkers = () => {
    if (!viewer.value) return
    
    const pinBuilder = new Cesium.PinBuilder();

    // Example marker 1
    viewer.value.entities.add({
        name: "西河排污口",
        position: Cesium.Cartesian3.fromDegrees(119.27, 26.08, 0),
        billboard: {
            image: pinBuilder.fromText("排", Cesium.Color.ROYALBLUE, 48).toDataURL(),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        },
        properties: {
            code: "DEV20240115",
            type: "排污口",
            material: "聚乙烯",
            elevation: "14mm",
            equipment: "水质检测仪、温度计",
            address: "鼓楼区西河公园",
            waterBody: "西河",
            region: "鼓楼区"
        }
    })
    
    // Example marker 2
    viewer.value.entities.add({
        name: "金山排污口",
        position: Cesium.Cartesian3.fromDegrees(119.28, 26.05, 0),
        billboard: {
             image: pinBuilder.fromText("排", Cesium.Color.ORANGE, 48).toDataURL(),
             verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        },
        properties: {
            code: "DEV20240116",
            type: "排污口",
            material: "混凝土",
            elevation: "12mm",
            equipment: "流量计",
            address: "仓山区金山公园",
            waterBody: "闽江",
            region: "仓山区"
        }
    })

    // Zoom to the marker
    viewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(119.27, 26.08, 15000)
    })
}

const closePopup = () => {
    showPopup.value = false
}

</script>

<template>
  <div class="map-container">
    <div ref="viewerContainer" class="cesium-container"></div>
    <OutletPopup :visible="showPopup" :data="popupData" @close="closePopup" />
  </div>
</template>

<style scoped lang="scss">
.map-container {
  height: 100%;
  width: 100%;
  display: flex;
}

.cesium-container {
  flex: 1;
  height: 100%;
  position: relative;
}
</style>
