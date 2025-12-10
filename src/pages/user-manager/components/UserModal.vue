<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus"
import type { UserData } from "../apis/type"
import { ElMessage } from "element-plus"
import { computed, reactive, ref } from "vue"
import { addUserApi, updateUserApi } from "../apis"

const emit = defineEmits(["success"])

const visible = ref(false)
const loading = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive({
  id: "",
  username: "",
  realname: "",
  phone: "",
  password: "",
  confirmPassword: "",
  userIdentity: 1,
  activitiSync: 1
})

function validateConfirmPassword(_rule: any, value: string, callback: any) {
  if (!isEdit.value && value !== formData.password) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}

const rules = computed<FormRules>(() => {
  const commonRules = {
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    realname: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
    // 手机号也必传
    phone: [{ required: true, message: "", trigger: "blur" }]
  }

  if (isEdit.value) {
    return commonRules
  } else {
    return {
      ...commonRules,
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      confirmPassword: [
        { required: true, message: "请再次输入密码", trigger: "blur" },
        { validator: validateConfirmPassword, trigger: "blur" }
      ]
    }
  }
})

function open(row?: UserData) {
  visible.value = true
  isEdit.value = !!row
  if (row) {
    formData.id = row.id
    formData.username = row.username
    formData.realname = row.realname
    formData.phone = row.phone || ""
    formData.userIdentity = row.userIdentity
    formData.activitiSync = row.activitiSync
    formData.password = ""
    formData.confirmPassword = ""
  } else {
    formData.username = ""
    formData.realname = ""
    formData.phone = ""
    formData.password = ""
    formData.confirmPassword = ""
    formData.userIdentity = 1
    formData.activitiSync = 1
  }
}

function handleClose() {
  visible.value = false
  formRef.value?.resetFields()
}

function handleSubmit() {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      const api = isEdit.value ? updateUserApi : addUserApi
      const data = { ...formData }

      // Encrypt password if present (for add)
      if (!isEdit.value) {
        // data.password = data.password
        // data.confirmPassword = data.confirmPassword
      } else {
        // Edit mode usually doesn't send password unless changed, but here we use separate API for password
        // So we remove password fields for update user info
        delete (data as any).password
        delete (data as any).confirmPassword
      }

      api(data)
        .then(() => {
          ElMessage.success(isEdit.value ? "编辑成功" : "新增成功")
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
  <el-dialog v-model="visible" :title="isEdit ? '编辑用户' : '新增用户'" width="500px" @close="handleClose">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realname">
        <el-input v-model="formData.realname" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号" />
      </el-form-item>

      <template v-if="!isEdit">
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="formData.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
        </el-form-item>
      </template>

      <!-- <el-form-item label="身份" prop="userIdentity">
        <el-radio-group v-model="formData.userIdentity">
          <el-radio :label="1">普通用户</el-radio>
          <el-radio :label="2">上级</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <!-- <el-form-item label="工作流同步" prop="activitiSync">
        <el-radio-group v-model="formData.activitiSync">
          <el-radio :label="1">同步</el-radio>
          <el-radio :label="0">不同步</el-radio>
        </el-radio-group>
      </el-form-item> -->
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
