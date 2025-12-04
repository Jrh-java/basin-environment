<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"

const props = defineProps<{ modelValue: boolean, record: any | null }>()
const emit = defineEmits<{ (e: "update:modelValue", v: boolean): void, (e: "submit", v: { nutrientStatus: string | number, upperLimit: number, lowerLimit: number, remarks?: string | null }): void }>()

const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v)
})

const form = reactive({
  nutrientStatus: "",
  upperLimit: null as number | null,
  lowerLimit: null as number | null,
  remarks: ""
})
const formRef = ref()
const rules = {
  nutrientStatus: [{ required: true, message: "请选择营养状态", trigger: "change" }],
  upperLimit: [{ required: true, message: "请输入上限", trigger: "change" }],
  lowerLimit: [{ required: true, message: "请输入下限", trigger: "change" }]
}

const title = ref("新增配置")

watch(() => props.record, (val) => {
  if (val) {
    title.value = "编辑配置"
    form.nutrientStatus = String(val.nutrientStatus ?? "")
    form.upperLimit = val.upperLimit ?? null
    form.lowerLimit = val.lowerLimit ?? null
    form.remarks = val.remarks ?? ""
  } else {
    title.value = "新增配置"
    form.nutrientStatus = ""
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
      nutrientStatus: form.nutrientStatus,
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
      <el-form-item label="营养状态">
        <el-select v-model="form.nutrientStatus" placeholder="请选择">
          <el-option label="低营养化" value="0" />
          <el-option label="中营养化" value="1" />
          <el-option label="高营养化" value="2" />
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
