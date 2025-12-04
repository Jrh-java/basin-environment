<script setup lang="ts">
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import { Refresh, Search, View } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import { onMounted, onUnmounted, reactive, ref } from "vue"
import TrendLine from "../components/TrendLine.vue"

defineOptions({
  name: "WaterLevel"
})

// 搜索表单
const searchForm = reactive({
  stationName: "",
  region: "",
  status: ""
})

// 表格数据
const loading = ref(false)
const tableData = ref<any[]>([])

// 模拟数据生成
function generateData() {
  const regions = ["鼓楼区", "台江区", "仓山区", "马尾区", "晋安区"]
  const data = []
  for (let i = 1; i <= 10; i++) {
    const isAlert = Math.random() > 0.8
    data.push({
      id: i,
      stationName: `监测站${i.toString().padStart(2, "0")}`,
      stationCode: `WS${202400 + i}`,
      region: regions[i % 5],
      connectionStatus: Math.random() > 0.1 ? "online" : "offline",
      temperature: (20 + Math.random() * 10).toFixed(1),
      realTimeLevel: (10 + Math.random() * 5).toFixed(2),
      normalLevel: 12.0,
      ecoLevel: 8.0,
      maxLevel: 18.0,
      floodLevel: 16.0,
      status: isAlert ? "警戒" : "正常",
      time: new Date().toLocaleString(),
      trendData: Array.from({ length: 10 }, () => 10 + Math.random() * 5)
    })
  }
  return data
}

// 初始化数据
function initData() {
  loading.value = true
  setTimeout(() => {
    tableData.value = generateData()
    loading.value = false
  }, 500)
}

// 定时刷新
let timer: any = null
function startRefresh() {
  timer = setInterval(() => {
    // 仅更新实时水位、时间和趋势数据，模拟实时效果
    tableData.value.forEach((row) => {
      const newValue = Number.parseFloat((10 + Math.random() * 5).toFixed(2))
      row.realTimeLevel = newValue.toFixed(2)
      row.time = new Date().toLocaleString()
      row.trendData.shift()
      row.trendData.push(newValue)
      // 更新状态
      row.status = newValue > row.floodLevel ? "警戒" : "正常"
    })
  }, 5000) // 5秒刷新一次
}

// 搜索
function handleSearch() {
  ElMessage.success("查询成功")
  initData()
}

// 重置
function handleReset() {
  searchForm.stationName = ""
  searchForm.region = ""
  searchForm.status = ""
  initData()
}

// 查看详情
function handleView(row: any) {
  ElMessage.info(`查看站点详情: ${row.stationName}`)
}

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 100
})
function handleSizeChange(val: number) {
  pagination.pageSize = val
  initData()
}
function handleCurrentChange(val: number) {
  pagination.currentPage = val
  initData()
}

onMounted(() => {
  initData()
  startRefresh()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <SearchTableLayout>
    <template #searchSlot>
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="站点名称">
          <el-input v-model="searchForm.stationName" placeholder="请输入站点名称" clearable />
        </el-form-item>
        <el-form-item label="行政区划">
          <el-select v-model="searchForm.region" placeholder="请选择" clearable style="width: 150px">
            <el-option label="鼓楼区" value="鼓楼区" />
            <el-option label="台江区" value="台江区" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 150px">
            <el-option label="正常" value="正常" />
            <el-option label="警戒" value="警戒" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            查询
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #tableSlot>
      <el-card shadow="never" class="table-card">
        <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
          <el-table-column prop="stationName" label="站点名称" min-width="120" align="center" fixed />
          <el-table-column prop="stationCode" label="测站编码" min-width="100" align="center" />
          <el-table-column prop="region" label="行政区划" min-width="100" align="center" />
          <el-table-column prop="connectionStatus" label="联网状态" min-width="90" align="center">
            <template #default="{ row }">
              <el-tag :type="row.connectionStatus === 'online' ? 'success' : 'info'" effect="plain">
                {{ row.connectionStatus === 'online' ? '在线' : '离线' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="temperature" label="温度(℃)" min-width="90" align="center" />
          <el-table-column prop="realTimeLevel" label="实时水位(m)" min-width="110" align="center">
            <template #default="{ row }">
              <span :class="{ 'text-danger': row.status === '警戒' }">{{ row.realTimeLevel }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="normalLevel" label="常水位(m)" min-width="100" align="center" />
          <el-table-column prop="ecoLevel" label="生态水位(m)" min-width="110" align="center" />
          <el-table-column prop="maxLevel" label="最高水位(m)" min-width="110" align="center" />
          <el-table-column prop="floodLevel" label="汛限水位(m)" min-width="110" align="center" />
          <el-table-column prop="status" label="状态" min-width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === '正常' ? 'success' : 'danger'">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="水位趋势" min-width="150" align="center">
            <template #default="{ row }">
              <TrendLine :data="row.trendData" :color="row.status === '警戒' ? '#f56c6c' : '#409eff'" />
            </template>
          </el-table-column>
          <el-table-column prop="time" label="监测时间" min-width="160" align="center" />
          <el-table-column label="操作" width="80" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link :icon="View" @click="handleView(row)">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </template>
  </SearchTableLayout>
</template>

<style scoped lang="scss">
.table-card {
  border: none;
  :deep(.el-card__body) {
    padding: 0;
  }
}
.pagination-container {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
.text-danger {
  color: var(--el-color-danger);
  font-weight: bold;
}
</style>
