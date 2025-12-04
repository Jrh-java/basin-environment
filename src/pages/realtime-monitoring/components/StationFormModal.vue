<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"

const props = defineProps<{ modelValue: boolean, record: any | null }>()
const emit = defineEmits<{ (e: "update:modelValue", v: boolean): void, (e: "submit", v: { id?: string, stationName: string, stationCode: string, administrativeRegion: string, latLong: string, networkStatus: string, delFlag: string }): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v)
})

const form = reactive({
  id: "",
  stationName: "",
  stationCode: "",
  administrativeRegion: "",
  latLong: "",
  networkStatus: "1",
  delFlag: "0"
})

const title = ref("新增站点")

watch(() => props.record, (val) => {
  if (val) {
    title.value = "编辑站点"
    form.id = val.id ?? ""
    form.stationName = val.stationName ?? ""
    form.stationCode = val.stationCode ?? ""
    form.administrativeRegion = val.administrativeRegion ?? ""
    form.latLong = val.latLong ?? ""
    form.networkStatus = String(val.networkStatus ?? "1")
    form.delFlag = String(val.delFlag ?? "0")
  } else {
    title.value = "新增站点"
    form.id = ""
    form.stationName = ""
    form.stationCode = ""
    form.administrativeRegion = ""
    form.latLong = ""
    form.networkStatus = "1"
    form.delFlag = "0"
  }
}, { immediate: true })

const formRef = ref()
const rules = {
  stationName: [{ required: true, message: "请输入站点名称", trigger: "blur" }],
  stationCode: [{ required: true, message: "请输入站点代码", trigger: "blur" }],
  administrativeRegion: [{ required: true, message: "请输入所在地区", trigger: "blur" }],
  latLong: [
    { required: true, message: "请输入经纬度", trigger: "blur" },
    {
      validator: (_: any, value: string, callback: (err?: Error) => void) => {
        const pattern = /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/
        if (!value || pattern.test(value)) callback()
        else callback(new Error("格式为 经度,纬度，例如 102.7123,25.0450"))
      },
      trigger: "blur"
    }
  ]
}

function close() {
  emit("update:modelValue", false)
}

function submit() {
  (formRef.value as any)?.validate?.((valid: boolean) => {
    if (!valid) return
    emit("submit", {
      id: form.id || undefined,
      stationName: form.stationName,
      stationCode: form.stationCode,
      administrativeRegion: form.administrativeRegion,
      latLong: form.latLong,
      networkStatus: form.networkStatus,
      delFlag: form.delFlag
    })
  })
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="520px" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="站点名称" prop="stationName">
        <el-input v-model="form.stationName" placeholder="请输入站点名称" />
      </el-form-item>
      <el-form-item label="经纬度" prop="latLong">
        <el-input v-model="form.latLong" placeholder="请输入经度,纬度，例如 102.7123,25.0450" />
      </el-form-item>
      <el-form-item label="站点代码" prop="stationCode">
        <el-input v-model="form.stationCode" placeholder="请输入站点代码" />
      </el-form-item>
      <el-form-item label="所在地区" prop="administrativeRegion">
        <el-input v-model="form.administrativeRegion" placeholder="请输入所在地区" />
      </el-form-item>
      <!-- <el-form-item label="网络状态">
        <el-select v-model="form.networkStatus" placeholder="请选择">
          <el-option label="在线" value="1" />
          <el-option label="离线" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="删除标记">
        <el-select v-model="form.delFlag" placeholder="请选择">
          <el-option label="正常" value="0" />
          <el-option label="删除" value="1" />
        </el-select>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" @click="submit">
        提交
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
</style>
