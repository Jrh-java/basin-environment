<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus"
import { reactive, ref } from "vue"

defineOptions({ name: "EventReporting" })

const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  eventName: "",
  eventType: "",
  eventTime: "",
  eventLocation: "",
  eventDesc: "",
  attachments: [],
  reporter: "",
  contact: "",
  unit: "",
  reportTime: "",
  suggestion: ""
})

// 表单校验规则
const rules = reactive<FormRules>({
  eventName: [{ required: true, message: "请输入事件名称", trigger: "blur" }],
  eventType: [{ required: true, message: "请选择事件类型", trigger: "change" }],
  eventTime: [{ required: true, message: "请选择发生时间", trigger: "change" }],
  eventLocation: [{ required: true, message: "请输入发生地点", trigger: "blur" }],
  eventDesc: [{ required: true, message: "请输入事件描述", trigger: "blur" }],
  reporter: [{ required: true, message: "请输入发起人", trigger: "blur" }],
  contact: [
    { required: true, message: "请输入联系方式", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" }
  ],
  unit: [{ required: true, message: "请输入发起单位", trigger: "blur" }]
})

// 提交表单
async function handleSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      ElMessage.success("提交成功")
      // TODO: 调用提交接口
    } else {
      ElMessage.error("请检查表单填写是否正确")
    }
  })
}

// 取消
function handleCancel() {
  ElMessageBox.confirm("确定要取消填报吗？已填写的内容将丢失", "提示", {
    type: "warning"
  }).then(() => {
    formRef.value?.resetFields()
  })
}

// 地图选择（模拟）
function handleSelectLocation() {
  ElMessage.info("打开地图选点功能")
}
</script>

<template>
  <div class="event-reporting-container">
    <el-card shadow="never" class="form-card">
      <template #header>
        <div class="card-header">
          <span class="title">| 事件填报</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        class="reporting-form"
      >
        <el-row :gutter="40">
          <!-- 左侧列 -->
          <el-col :span="12">
            <el-form-item label="事件名称：" prop="eventName">
              <el-input v-model="formData.eventName" placeholder="请输入事件名称" />
            </el-form-item>
            <el-form-item label="事件类型：" prop="eventType">
              <el-select v-model="formData.eventType" placeholder="请选择事件类型" style="width: 100%">
                <el-option label="预警事件" value="warning" />
                <el-option label="突发事件" value="emergency" />
                <el-option label="日常巡检" value="daily" />
              </el-select>
            </el-form-item>
            <el-form-item label="发生时间：" prop="eventTime">
              <el-date-picker
                v-model="formData.eventTime"
                type="datetime"
                placeholder="选择发生时间"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
              />
            </el-form-item>
            <el-form-item label="发生地点：" prop="eventLocation">
              <div class="location-input">
                <el-input v-model="formData.eventLocation" placeholder="选择地图标注或手工录入" />
                <el-button type="primary" plain @click="handleSelectLocation">
                  选择
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="事件描述：" prop="eventDesc">
              <el-input
                v-model="formData.eventDesc"
                type="textarea"
                :rows="6"
                placeholder="请填写事件描述"
              />
            </el-form-item>
            <el-form-item label="附件：">
              <el-upload action="#" list-type="picture-card" :auto-upload="false">
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>

          <!-- 右侧列 -->
          <el-col :span="12">
            <el-form-item label="发起人：" prop="reporter">
              <el-input v-model="formData.reporter" placeholder="请输入发起人姓名" />
            </el-form-item>
            <el-form-item label="联系方式：" prop="contact">
              <el-input v-model="formData.contact" placeholder="请输入联系方式" />
            </el-form-item>
            <el-form-item label="发起单位：" prop="unit">
              <el-input v-model="formData.unit" placeholder="请输入发起单位" />
            </el-form-item>
            <el-form-item label="发起时间：">
              <el-date-picker
                v-model="formData.reportTime"
                type="datetime"
                placeholder="系统自动生成"
                style="width: 100%"
                disabled
              />
            </el-form-item>
            <el-form-item label="处置建议：">
              <el-input
                v-model="formData.suggestion"
                type="textarea"
                :rows="6"
                placeholder="请填写处置建议"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="form-footer">
          <el-button class="btn-cancel" @click="handleCancel">
            取消
          </el-button>
          <el-button type="primary" class="btn-submit" @click="handleSubmit(formRef)">
            提交
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.event-reporting-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100%;

  .form-card {
    border-radius: 8px;
  }

  .card-header {
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
    }
  }

  .reporting-form {
    padding: 20px;
  }

  .location-input {
    display: flex;
    gap: 10px;
    width: 100%;
  }

  .form-footer {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;

    .btn-cancel,
    .btn-submit {
      width: 120px;
    }
  }
}
</style>
