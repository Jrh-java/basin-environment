<script setup lang="ts">
import type { VNode } from "vue"
import * as Cesium from "cesium"
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"

interface Props {
  viewer: Cesium.Viewer
  title: string
  content?: string | VNode
  longitude: number
  latitude: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: "close"): void }>()

const containerRef = ref<HTMLElement | null>(null)
const left = ref(0)
const top = ref(0)

const cartesian = computed(() => Cesium.Cartesian3.fromDegrees(props.longitude, props.latitude))

function updatePosition() {
  try {
    const winPos = Cesium.SceneTransforms.worldToWindowCoordinates(props.viewer.scene, cartesian.value)
    if (winPos) {
      left.value = winPos.x
      top.value = winPos.y
    } else {
      const rect = props.viewer.canvas.getBoundingClientRect()
      left.value = rect.width / 2
      top.value = rect.height / 2
    }
  } catch {
    const rect = props.viewer.canvas.getBoundingClientRect()
    left.value = rect.width / 2
    top.value = rect.height / 2
  }
}

function onClose() {
  emit("close")
}

let postRenderHandler: any | null = null

onMounted(() => {
  updatePosition()
  // 绑定场景渲染后事件，实时刷新位置
  postRenderHandler = props.viewer.scene.postRender?.addEventListener(() => {
    updatePosition()
  }) ?? null
})

onBeforeUnmount(() => {
  if (postRenderHandler && props.viewer.scene.postRender?.removeEventListener) {
    props.viewer.scene.postRender.removeEventListener(postRenderHandler)
  }
})

watch(() => [props.longitude, props.latitude], () => updatePosition(), { immediate: true })
</script>

<template>
  <div
    ref="containerRef"
    class="smart-popup"
    :style="{ left: `${left}px`, top: `${top}px` }"
  >
    <div class="smart-popup__panel">
      <div class="smart-popup__header">
        <span class="smart-popup__title">{{ props.title }}</span>
        <button class="smart-popup__close" @click="onClose">
          ×
        </button>
      </div>
      <div class="smart-popup__content">
        <template v-if="typeof props.content === 'string'">
          <div v-html="props.content" />
        </template>
        <template v-else>
          <component v-if="props.content" :is="props.content as any" />
          <slot v-else />
        </template>
      </div>
      <div class="smart-popup__tip" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.smart-popup {
  position: absolute;
  z-index: 10;
  transform: translate(-50%, -100%);
  pointer-events: auto;
  animation: popup-fade-in 160ms ease-out;
}

.smart-popup__panel {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  min-width: 240px;
  max-width: 360px;
}

.smart-popup__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(64, 158, 255, 0.15);
  border-bottom: 1px solid var(--el-border-color-light);
}

.smart-popup__title {
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.smart-popup__close {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.smart-popup__content {
  padding: 10px 12px;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.smart-popup__tip {
  width: 10px;
  height: 10px;
  background: var(--el-bg-color-overlay);
  border-left: 1px solid var(--el-border-color);
  border-top: 1px solid var(--el-border-color);
  transform: rotate(45deg);
  margin: 0 auto;
  position: relative;
  top: 6px;
}

@keyframes popup-fade-in {
  from {
    opacity: 0;
    transform: translate(-50%, -96%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -100%);
  }
}
</style>
