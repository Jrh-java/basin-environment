<script setup lang="ts">
// 接口与类型统一改为 http/system
import type { AnnouncementDetail } from "@/http/system/announcement"
import { ElMessage } from "element-plus"
import { ref, watch } from "vue"
import { getAnnouncementDetailApi } from "@/http/system/announcement"

interface Props {
  modelValue: boolean
  announcementId?: string
}

interface Emits {
  (e: "update:modelValue", value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = ref(false)
const loading = ref(false)
const detail = ref<AnnouncementDetail | null>(null)

// 监听props变化
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    if (val && props.announcementId) {
      fetchDetail()
    }
  },
  { immediate: true }
)

// 监听visible变化
watch(visible, (val) => {
  emit("update:modelValue", val)
})

// 获取公告详情
async function fetchDetail() {
  if (!props.announcementId) return

  try {
    loading.value = true
    const res = await getAnnouncementDetailApi(props.announcementId)
    detail.value = res?.data || null
  } catch (error) {
    console.error("获取公告详情失败:", error)
    ElMessage.error("获取公告详情失败")
  } finally {
    loading.value = false
  }
}

// 关闭弹窗
function handleClose() {
  visible.value = false
  detail.value = null
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="公告详情"
    width="700px"
    :lock-scroll="false"
    @close="handleClose"
  >
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <div v-else-if="detail" class="detail-container">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="公告标题" :span="2">
          {{ detail.noticeTitle }}
        </el-descriptions-item>

        <el-descriptions-item label="公告类型">
          <el-tag :type="detail.noticeType === '1' ? 'primary' : 'success'">
            {{ detail.noticeType === '1' ? '通知' : '公告' }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="发布人员">
          {{ detail.crtName || '未知' }}
        </el-descriptions-item>

        <el-descriptions-item label="发布时间" :span="2">
          {{ detail.crtTime }}
        </el-descriptions-item>

        <el-descriptions-item label="附件" :span="2">
          <span v-if="detail.file">
            <el-link type="primary" :href="detail.file" target="_blank">
              {{ detail.file }}
            </el-link>
          </span>
          <span v-else class="no-data">无附件</span>
        </el-descriptions-item>

        <el-descriptions-item label="公告内容" :span="2">
          <div class="content-text">
            {{ detail.noticeContent }}
          </div>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 接收人员状态 -->
      <div class="recipients-section">
        <h4>接收人员状态</h4>
        <el-table
          :data="detail.userNoticeVOS"
          border
          style="width: 100%"
          max-height="300"
        >
          <el-table-column
            prop="userName"
            label="用户姓名"
            align="center"
          />

          <el-table-column
            prop="status"
            label="阅读状态"

            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="row.status === 'T' ? 'success' : 'warning'">
                {{ row.status === 'T' ? '已读' : '未读' }}
              </el-tag>
            </template>
          </el-table-column>
          <!--
          <el-table-column
            label="操作"
            align="center"
          >
            <template #default="{ row }">
              <el-button
                type="text"
                :disabled="row.status === 'T'"
                @click="markAsRead(row)"
              >
                标记已读
              </el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">
          关闭
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.loading-container {
  padding: 20px;
}

.detail-container {
  .content-text {
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.6;
    max-height: 200px;
    overflow-y: auto;
  }

  .no-data {
    color: #999;
    font-style: italic;
  }
}

.recipients-section {
  margin-top: 20px;

  h4 {
    margin-bottom: 10px;
    color: #333;
    font-size: 14px;
  }
}

.dialog-footer {
  text-align: right;
}
</style>
