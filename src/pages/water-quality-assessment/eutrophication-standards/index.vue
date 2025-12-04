<script setup lang="ts">
import type { EutrophicationRecord } from "@/http/water/eutrophication-evaluation-config"
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import { onMounted, ref } from "vue"
import { addEutrophicationEvaluationConfig, deleteEutrophicationEvaluationConfig, editEutrophicationEvaluationConfig, getEutrophicationEvaluationConfigPage } from "@/http/water/eutrophication-evaluation-config"
import ConfigModal from "./components/ConfigModal.vue"

defineOptions({ name: "EutrophicationStandards" })

const nutrientStatus = ref<string | number>("")
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const list = ref<EutrophicationRecord[]>([])

const dialogVisible = ref(false)
const editingRow = ref<EutrophicationRecord | null>(null)

const statusOptions = [
  { label: "低营养化", value: "0" },
  { label: "中营养化", value: "1" },
  { label: "高营养化", value: "2" }
]

function formatStatus(val: string | number) {
  const v = String(val)
  const item = statusOptions.find(i => i.value === v)
  return item ? item.label : v
}

async function fetchList() {
  loading.value = true
  try {
    const res = await getEutrophicationEvaluationConfigPage({
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      nutrientStatus: nutrientStatus.value || undefined
    })
    const records = res.result?.records || []
    list.value = records
    total.value = (res.result?.total as number) ?? records.length
  } catch {
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function onSearch() {
  pageNo.value = 1
  fetchList()
}

function onPageChange(val: number) {
  pageNo.value = val
  fetchList()
}

function onSizeChange(val: number) {
  pageSize.value = val
  pageNo.value = 1
  fetchList()
}

function onAdd() {
  editingRow.value = null
  dialogVisible.value = true
}

function onEdit(row: EutrophicationRecord) {
  editingRow.value = { ...row }
  dialogVisible.value = true
}

async function onDelete(row: EutrophicationRecord) {
  await ElMessageBox.confirm("确定删除该配置吗？", "提示", { type: "warning" })
  await deleteEutrophicationEvaluationConfig(row.id)
  ElMessage.success("删除成功")
  fetchList()
}

async function onSubmit(values: { nutrientStatus: string | number, upperLimit: number, lowerLimit: number, remarks?: string | null }) {
  if (editingRow.value) {
    await editEutrophicationEvaluationConfig({ id: editingRow.value.id, ...values })
    ElMessage.success("更新成功")
  } else {
    await addEutrophicationEvaluationConfig(values)
    ElMessage.success("新增成功")
  }
  dialogVisible.value = false
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<template>
  <SearchTableLayout>
    <template #searchSlot>
      <div class="search-bar" v-loading="loading">
        <div class="left">
          <el-select v-model="nutrientStatus" placeholder="营养状态" clearable class="w50">
            <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
          <el-button type="primary" @click="onSearch">
            搜索
          </el-button>
        </div>
        <el-button type="primary" @click="onAdd">
          新增
        </el-button>
      </div>
    </template>

    <template #tableSlot>
      <el-table :data="list" border style="width: 100%" :header-cell-style="{ whiteSpace: 'nowrap' }">
        <el-table-column label="营养状态" prop="nutrientStatus" align="center" :formatter="(_, __, val) => formatStatus(val)" />
        <el-table-column label="上限" prop="upperLimit" align="center" width="120" />
        <el-table-column label="下限" prop="lowerLimit" align="center" width="120" />
        <el-table-column label="备注" prop="remarks" align="center" />
        <el-table-column label="操作" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="onEdit(row)">
              编辑
            </el-button>
            <el-button link type="danger" @click="onDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page="pageNo"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          @current-change="onPageChange"
          @size-change="onSizeChange"
        />
      </div>

      <ConfigModal v-model="dialogVisible" :record="editingRow" @submit="onSubmit" />
    </template>
  </SearchTableLayout>
</template>

<style scoped lang="scss">
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left {
  display: flex;
  gap: 8px;
  align-items: center;
}
.w50 {
  width: 50px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
}
</style>
