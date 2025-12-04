<script setup lang="ts">
import { onMounted, ref, shallowRef, onUnmounted } from "vue"
import * as Cesium from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"

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



</script>

<template>
  <div class="map-container">
    <div ref="viewerContainer" class="cesium-container"></div>
 
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
