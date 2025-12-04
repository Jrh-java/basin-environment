<script setup lang="ts">
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import { Refresh, Search, ZoomIn } from "@element-plus/icons-vue"
import { reactive, ref } from "vue"

defineOptions({
  name: "WarningInfo"
})

// 搜索表单数据
const searchForm = reactive({
  stationName: "",
  timeRange: [],
  warningType: "",
  warningLevel: ""
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    stationName: "洪山桥北侧01",
    warningTime: "2025-02-01 16:45:51",
    warningType: "氨氮超标",
    warningLevel: "中等",
    content: "氨氮≥1.2",
    location: "鼓楼区洪山桥西侧300m",
    details: "氨氮浓度持续偏高，建议检查上游排污情况。"
  },
  {
    id: 2,
    stationName: "洪山桥北侧01",
    warningTime: "2025-02-01 16:45:51",
    warningType: "河道口有污水",
    warningLevel: "中等",
    content: "氨氮≥1.2",
    location: "鼓楼区洪山桥西侧300m",
    details: "发现排污口有异常排放。"
  },
  {
    id: 3,
    stationName: "洪山桥北侧01",
    warningTime: "2025-03-01 16:25:25",
    warningType: "河道口有污水",
    warningLevel: "中等",
    content: "氨氮≥1.2",
    location: "西河公园南侧300m",
    details: "水体颜色异常，有异味。"
  },
  {
    id: 4,
    stationName: "洪山桥北侧01",
    warningTime: "2025-02-01 16:45:51",
    warningType: "河道口有污水",
    warningLevel: "中等",
    content: "氨氮≥1.2",
    location: "鼓楼区洪山桥西侧300m",
    details: "监测数据异常波动。"
  }
])

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 50,
  total: 4
})

// 当前选中的预警详情
const currentWarning = ref<any>(null)

// 处理表格行点击
function handleRowClick(row: any) {
  currentWarning.value = row
}

// 处理搜索
function handleSearch() {
  console.log("Search with:", searchForm)
}

// 重置搜索
function handleReset() {
  searchForm.stationName = ""
  searchForm.timeRange = []
  searchForm.warningType = ""
  searchForm.warningLevel = ""
}

// 处理分页变化
function handleSizeChange(val: number) {
  pagination.pageSize = val
}
function handleCurrentChange(val: number) {
  pagination.currentPage = val
}
</script>

<template>
  <SearchTableLayout>
    <template #searchSlot>
      <el-form :model="searchForm" label-width="100px" :inline="true">
        <el-form-item label="监测站点名称">
          <el-input v-model="searchForm.stationName" placeholder="请输入站点名称" clearable />
        </el-form-item>
        <el-form-item label="预警时间">
          <el-date-picker
            v-model="searchForm.timeRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="预警类型">
          <el-select v-model="searchForm.warningType" placeholder="请选择" clearable style="width: 180px">
            <el-option label="氨氮超标" value="氨氮超标" />
            <el-option label="河道口有污水" value="河道口有污水" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警程度">
          <el-select v-model="searchForm.warningLevel" placeholder="请选择" clearable style="width: 180px">
            <el-option label="中等" value="中等" />
            <el-option label="严重" value="严重" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            查询
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">
            清空
          </el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #tableSlot>
      <el-card shadow="never" class="table-card">
        <el-table
          :data="tableData"
          style="width: 100%"
          highlight-current-row
          @row-click="handleRowClick"
        >
          <el-table-column prop="stationName" label="站点名称" min-width="150" />
          <el-table-column prop="warningTime" label="预警时间" min-width="180" sortable />
          <el-table-column prop="warningType" label="预警类型" min-width="120" />
          <el-table-column prop="warningLevel" label="预警程度" min-width="100">
            <template #default="{ row }">
              <el-tag :type="row.warningLevel === '严重' ? 'danger' : 'warning'">
                {{ row.warningLevel }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="预警内容" min-width="150" />
          <el-table-column prop="location" label="预警位置" min-width="200" />
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

      <!-- 底部预警详情面板 -->
      <transition name="el-fade-in">
        <div v-if="currentWarning" class="detail-panel">
          <div class="panel-header">
            <span class="title">| 预警详细信息</span>
          </div>
          <div class="panel-content">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" class="mb-4">
                <el-card shadow="never" class="info-card">
                  <template #header>
                    <span>详细信息</span>
                  </template>
                  <div class="info-text">
                    <p><strong>预警内容：</strong>{{ currentWarning.content }}</p>
                    <p><strong>详细描述：</strong>{{ currentWarning.details }}</p>
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12">
                <el-card shadow="never" class="map-card">
                  <template #header>
                    <span>预警位置</span>
                  </template>
                  <div class="map-placeholder">
                    <!-- 这里可以是地图组件或者图片 -->
                    <div class="mock-map">
                      <el-icon :size="40" color="#909399">
                        <ZoomIn />
                      </el-icon>
                      <span>地图位置示意: {{ currentWarning.location }}</span>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
      </transition>
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

.detail-panel {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;

  .panel-header {
    margin-bottom: 16px;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
      border-left: 4px solid #409eff;
      padding-left: 10px;
    }
  }

  .info-card,
  .map-card {
    height: 100%;
  }

  .info-text {
    line-height: 1.8;
    color: #606266;
  }

  .map-placeholder {
    height: 200px;
    background-color: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;

    .mock-map {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: #909399;
    }
  }
}
</style>
