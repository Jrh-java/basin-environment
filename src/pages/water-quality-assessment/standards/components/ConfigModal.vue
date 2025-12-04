<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"

const props = defineProps<{ modelValue: boolean, record: any | null }>()
const emit = defineEmits<{ (e: "update:modelValue", v: boolean): void, (e: "submit", v: { parameterName: string, waterQualityLevel: string | number, upperLimit: number, lowerLimit: number, remarks?: string | null }): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v)
})

const form = reactive({
  parameterName: "",
  waterQualityLevel: "",
  upperLimit: null as number | null,
  lowerLimit: null as number | null,
  remarks: ""
})
const formRef = ref()
const rules = {
  parameterName: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
  waterQualityLevel: [{ required: true, message: "请选择水质等级", trigger: "change" }],
  upperLimit: [{ required: true, message: "请输入上限", trigger: "change" }],
  lowerLimit: [{ required: true, message: "请输入下限", trigger: "change" }]
}

const title = ref("新增配置")

watch(() => props.record, (val) => {
  if (val) {
    title.value = "编辑配置"
    form.parameterName = val.parameterName ?? ""
    form.waterQualityLevel = String(val.waterQualityLevel ?? "")
    form.upperLimit = val.upperLimit ?? null
    form.lowerLimit = val.lowerLimit ?? null
    form.remarks = val.remarks ?? ""
  } else {
    title.value = "新增配置"
    form.parameterName = ""
    form.waterQualityLevel = ""
    form.upperLimit = null
    form.lowerLimit = null
    form.remarks = ""
  }
}, { immediate: true })

function close() {
  emit("update:modelValue", false)
}

function submit() {
  (formRef.value as any)?.validate?.((valid: boolean) => {
    if (!valid) return
    emit("submit", {
      parameterName: form.parameterName,
      waterQualityLevel: form.waterQualityLevel,
      upperLimit: Number(form.upperLimit ?? 0),
      lowerLimit: Number(form.lowerLimit ?? 0),
      remarks: form.remarks || ""
    })
  })
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="520px" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="参数名称">
        <el-input v-model="form.parameterName" placeholder="请输入参数名称" />
      </el-form-item>
      <el-form-item label="水质等级">
        <el-select v-model="form.waterQualityLevel" placeholder="请选择">
          <el-option v-for="n in 5" :key="n" :label="String(n)" :value="String(n)" />
        </el-select>
      </el-form-item>
      <el-form-item label="上限">
        <el-input-number v-model="form.upperLimit" :min="0" :max="999999" />
      </el-form-item>
      <el-form-item label="下限">
        <el-input-number v-model="form.lowerLimit" :min="0" :max="999999" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remarks" type="textarea" :rows="3" placeholder="请输入备注" />
      </el-form-item>
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
