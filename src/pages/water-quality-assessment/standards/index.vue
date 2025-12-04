<script setup lang="ts">
import type { WaterEvaluationConfigRecord } from "@/http/water/water-evaluation-config"
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { onMounted, ref } from "vue"
import { addWaterEvaluationConfig, deleteWaterEvaluationConfig, editWaterEvaluationConfig, getWaterEvaluationConfigPage } from "@/http/water/water-evaluation-config"
import ConfigModal from "./components/ConfigModal.vue"

defineOptions({ name: "WaterQualityStandards" })

const grade = ref<string | number>("")
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const list = ref<WaterEvaluationConfigRecord[]>([])

const dialogVisible = ref(false)
const editingRow = ref<WaterEvaluationConfigRecord | null>(null)

async function fetchList() {
  loading.value = true
  try {
    const res = await getWaterEvaluationConfigPage({
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      waterQualityGrade: grade.value || undefined
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

function onEdit(row: WaterEvaluationConfigRecord) {
  editingRow.value = { ...row }
  dialogVisible.value = true
}

async function onDelete(row: WaterEvaluationConfigRecord) {
  await ElMessageBox.confirm("确定删除该配置吗？", "提示", { type: "warning" })
  await deleteWaterEvaluationConfig(row.id)
  ElMessage.success("删除成功")
  fetchList()
}

async function onSubmit(values: { parameterName: string, waterQualityLevel: string | number, upperLimit: number, lowerLimit: number, remarks?: string | null }) {
  if (editingRow.value) {
    await editWaterEvaluationConfig({ id: editingRow.value.id, ...values })
    ElMessage.success("更新成功")
  } else {
    await addWaterEvaluationConfig(values)
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
          <el-select v-model="grade" placeholder="水质级别" clearable class="w50">
            <el-option v-for="n in 5" :key="n" :label="String(n)" :value="String(n)" />
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
        <el-table-column label="参数名称" prop="parameterName" align="center" />
        <el-table-column label="水质等级" prop="waterQualityLevel" align="center" width="120" />
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
.w160 {
  width: 160px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
}
</style>
