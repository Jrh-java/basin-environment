<script setup lang="ts">
import type { QualityReportRow } from "@/http/water/quality-report"
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import dayjs from "dayjs"
import { ElMessage } from "element-plus"
import { onMounted, ref } from "vue"
import { getQualityReportList } from "@/http/water/quality-report"

defineOptions({ name: "MonthlyReport" })

const sectionName = ref("")
const month = ref<string>(dayjs().format("YYYY-MM"))

const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)
const list = ref<QualityReportRow[]>([])

function getMonthRange(val: string) {
  const d = dayjs(`${val}-01`)
  const begin = d.startOf("month")
  const end = d.endOf("month")
  return { begin: begin.format("YYYY-MM-DD"), end: end.format("YYYY-MM-DD") }
}

async function fetchList() {
  loading.value = true
  try {
    const { begin, end } = getMonthRange(month.value)
    const res = await getQualityReportList({
      page: page.value,
      limit: limit.value,
      sectionName: sectionName.value || undefined,
      beginTime: begin,
      endTime: end,
      selectType: 3
    })
    const records = res.result?.records || []
    list.value = records
    total.value = res.result?.total ?? records.length
  } catch (err: any) {
    ElMessage.error(err?.message || "查询失败")
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function onSearch() {
  page.value = 1
  fetchList()
}

function onPageChange(val: number) {
  page.value = val
  fetchList()
}

function onSizeChange(val: number) {
  limit.value = val
  page.value = 1
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
          <el-input v-model="sectionName" placeholder="监测点" clearable class="w160" />
          <el-date-picker v-model="month" type="month" format="YYYY-MM" value-format="YYYY-MM" placeholder="选择月份" />
          <el-button type="primary" @click="onSearch">
            查询
          </el-button>
        </div>
      </div>
    </template>

    <template #tableSlot>
      <el-table :data="list" border style="width: 100%" :header-cell-style="{ whiteSpace: 'nowrap' }" empty-text="暂无数据">
        <el-table-column label="监测点" prop="sectionName" align="center" />
        <el-table-column label="测站编码" prop="stationCode" align="center" />
        <el-table-column label="流域" prop="riverName" align="center" />
        <el-table-column label="检测参数" prop="monitoringParam" align="center" />
        <el-table-column label="断面功能" prop="sectionFunction" align="center" />
        <el-table-column label="功能区类别" prop="sectionType" align="center" />
        <el-table-column label="水质级别" prop="waterQualityLevel" align="center" />
        <el-table-column label="检测时间" prop="monitoringTime" align="center" />
        <el-table-column label="环比" prop="chainRatio" align="center" />
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[10, 20, 50, 100]"
          @current-change="onPageChange"
          @size-change="onSizeChange"
        />
      </div>
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
