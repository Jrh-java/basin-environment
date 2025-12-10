<script setup lang="ts">
import type { WaterStationRow } from "@/http/water/water-station"
import type { WaterStationMonitoringQuery, WaterStationMonitoringRow } from "@/http/water/water-station-monitoring"
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"

import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { addWaterStation, deleteWaterStation, editWaterStation, getWaterStationList } from "@/http/water/water-station"
import { getWaterStationMonitoringPage } from "@/http/water/water-station-monitoring"
import StationDetailModal from "./components/StationDetailModal.vue"
import StationFormModal from "./components/StationFormModal.vue"
import { columns } from "./WaterStationMonitoring.data"

defineOptions({ name: "RealtimeMonitoringIndex" })

const networkStatusIndex = columns.findIndex(c => c.prop === "networkStatus")
const beforeColumns = networkStatusIndex >= 0 ? columns.slice(0, networkStatusIndex) : columns
const afterColumns = networkStatusIndex >= 0 ? columns.slice(networkStatusIndex + 1) : []

const route = useRoute()
const stationName = ref("")
const selectedStationCode = ref<string>("")
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)
const list = ref<WaterStationMonitoringRow[]>([])

const detailVisible = ref(false)
const currentRow = ref<WaterStationMonitoringRow | null>(null)

// 左侧站点列表
const stationSearch = ref("")
const stationLoading = ref(false)
const stationList = ref<WaterStationRow[]>([])
const stationPage = ref(1)
const stationLimit = ref(10)

async function fetchStationList() {
  stationLoading.value = true
  try {
    const res = await getWaterStationList({ stationName: stationSearch.value || undefined })
    stationList.value = Array.isArray(res.result) ? res.result : []
  } catch (err: any) {
    ElMessage.error(err?.message || "站点列表获取失败")
    stationList.value = []
  } finally {
    stationLoading.value = false
  }
}

function onSelectStation(row: WaterStationRow) {
  stationName.value = row.stationName
  selectedStationCode.value = row.stationCode
  page.value = 1
  fetchList()
}

function onStationSearch() {
  stationPage.value = 1
  fetchStationList()
}

const editingStation = ref<WaterStationRow | null>(null)
const stationDialogVisible = ref(false)

function onAddStation() {
  editingStation.value = null
  stationDialogVisible.value = true
}

function onEditStation(row: WaterStationRow) {
  editingStation.value = { ...row }
  stationDialogVisible.value = true
}

async function onDeleteStation(row: WaterStationRow) {
  await ElMessageBox.confirm("确定删除该站点吗？", "提示", { type: "warning" })
  try {
    await deleteWaterStation(row.id)
    ElMessage.success("删除成功")
    fetchStationList()
    if (stationName.value === row.stationName) fetchList()
  } catch (err: any) {
    ElMessage.error(err?.message || "删除失败")
  }
}

async function onSubmitStation(values: { id?: string, stationName: string, stationCode: string, administrativeRegion: string, latLong: string, networkStatus: string, delFlag: string }) {
  try {
    if (editingStation.value?.id) {
      await editWaterStation({ id: editingStation.value.id, ...values })
      ElMessage.success("更新成功")
    } else {
      await addWaterStation(values)
      ElMessage.success("新增成功")
    }
    stationDialogVisible.value = false
    fetchStationList()
  } catch (err: any) {
    ElMessage.error(err?.message || "提交失败")
  }
}
async function fetchList() {
  loading.value = true
  const params: WaterStationMonitoringQuery = {
    page: page.value,
    limit: limit.value,
    stationName: selectedStationCode.value || undefined
  }
  try {
    const res = await getWaterStationMonitoringPage(params)
    total.value = res.result.total
    list.value = res.result.records || []
  } catch {
    list.value = []
  } finally {
    loading.value = false
  }
}

function onView(row: WaterStationMonitoringRow) {
  currentRow.value = row
  detailVisible.value = true
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

onMounted(async () => {
  await fetchStationList()
  const q = route.query?.stationName
  if (typeof q === "string" && q) {
    stationName.value = q
    const match = stationList.value.find(s => s.stationName === q)
    selectedStationCode.value = match?.stationCode || ""
  }
  fetchList()
})
</script>

<template>
  <div class="monitoring-page">
    <div class="station-panel" v-loading="stationLoading">
      <div class="panel-header">
        <el-input v-model="stationSearch" placeholder="站点名称" clearable class="w160" />
        <el-button type="primary" @click="onStationSearch">
          查询
        </el-button>
        <el-button type="success" @click="onAddStation">
          新增
        </el-button>
      </div>
      <div class="station-list">
        <el-dropdown
          v-for="s in stationList.slice((stationPage - 1) * stationLimit, stationPage * stationLimit)"
          :key="s.id"
          trigger="contextmenu"
          class="w-full"
        >
          <div
            class="station-item"
            :class="{ active: s.stationCode === selectedStationCode }"
            @click="onSelectStation(s)"
          >
            <div class="item-content">
              <span class="name">{{ s.stationName }}</span>
              <span class="code">{{ s.stationCode }}</span>
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="onEditStation(s)">
                编辑
              </el-dropdown-item>
              <el-dropdown-item divided @click="onDeleteStation(s)">
                删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- <div class="panel-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="stationList.length"
          :current-page="stationPage"
          :page-size="stationLimit"
          :page-sizes="[10, 20, 50, 100]"
          @current-change="onStationPageChange"
          @size-change="onStationSizeChange"
        />
      </div> -->
      <StationFormModal v-model="stationDialogVisible" :record="editingStation" @submit="onSubmitStation" />
    </div>

    <div class="content-panel">
      <SearchTableLayout>
        <template #searchSlot>
          <div class="selected-info">
            <template v-if="selectedStationCode">
              <span class="info-label">当前站点：</span>
              <span class="info-value">{{ stationName }} - {{ selectedStationCode }}</span>
            </template>
            <span v-else class="info-empty">请选择监测站点</span>
          </div>
        </template>

        <template #tableSlot>
          <div class="table-wrapper">
            <el-table :data="list" border style="width: 100%" :header-cell-style="{ whiteSpace: 'nowrap' }">
              <el-table-column
                v-for="col in beforeColumns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :align="col.align"
                :width="col.width"
                :fixed="col.fixed"
                :formatter="col.formatter"
              />

              <el-table-column label="联网状态" align="center" width="100">
                <template #default="{ row }">
                  <el-tag :type="(row.networkStatus === '已连接' || row.networkStatus === 1 || row.networkStatus === '1') ? 'success' : 'info'" effect="plain">
                    {{ (row.networkStatus === '已连接' || row.networkStatus === 1 || row.networkStatus === '1') ? '已连接' : '未连接' }}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column
                v-for="col in afterColumns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :align="col.align"
                :width="col.width"
                :fixed="col.fixed"
                :formatter="col.formatter"
              />

              <el-table-column label="趋势" fixed="right" align="center" width="*">
                <template #default="{ row }">
                  <div class="trend-cell">
                    <el-button link type="primary" @click="onView(row)">
                      查看
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>

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

          <StationDetailModal v-model="detailVisible" :row="currentRow" />
        </template>
      </SearchTableLayout>
    </div>
  </div>
</template>

<style scoped lang="scss">
.monitoring-page {
  display: flex;
  gap: 12px;
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
  overflow: hidden;
}
.station-panel {
  margin-top: 15px;
  width: 280px;
  flex: none;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 12px;
  height: 100%;
}
.panel-header {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-bottom: 8px;
}
.station-list {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.station-item {
  padding: 6px 8px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  background: var(--el-bg-color);
  transition: all 0.3s;
  cursor: pointer;
  width: 100%;
  &.active {
    background: var(--el-color-primary);
    border-color: var(--el-color-primary);

    .item-content {
      .name,
      .code {
        color: #fff;
      }
    }
  }
}
.item-content {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
.item-content .name {
  font-weight: 600;
}
.item-content .code {
  color: #909399;
  font-size: 13px;
}

.selected-info {
  display: flex;
  align-items: center;
  height: 32px;

  .info-label {
    font-weight: bold;
    color: var(--el-text-color-regular);
    margin-right: 8px;
  }

  .info-value {
    color: var(--el-color-primary);
    font-weight: 600;
    font-size: 16px;
  }

  .info-empty {
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }
}
.panel-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
}
.content-panel {
  flex: 1;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.table-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.trend-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
}
</style>
