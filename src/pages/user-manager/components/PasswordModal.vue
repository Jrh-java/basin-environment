<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus"
import type { UserData } from "../apis/type"
import { ElMessage } from "element-plus"
import { reactive, ref } from "vue"
import { changePasswordApi } from "../apis"

const emit = defineEmits(["success"])

const visible = ref(false)
const loading = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive({
  username: "",
  password: "",
  confirmPassword: ""
})

function validateConfirmPassword(_rule: any, value: string, callback: any) {
  if (value !== formData.password) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}

const rules: FormRules = {
  password: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    { validator: validateConfirmPassword, trigger: "blur" }
  ]
}

function open(row: UserData) {
  visible.value = true
  formData.username = row.username
  formData.password = ""
  formData.confirmPassword = ""
}

function handleClose() {
  visible.value = false
  formRef.value?.resetFields()
}

function handleSubmit() {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      // Encrypt passwords
      const data = {
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      }

      changePasswordApi(data)
        .then(() => {
          ElMessage.success("密码修改成功")
          emit("success")
          handleClose()
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="visible" title="修改密码" width="500px" @close="handleClose">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="formData.username" disabled />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="formData.password" type="password" placeholder="请输入新密码" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="formData.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">
        取消
      </el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
