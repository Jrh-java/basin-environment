<script setup lang="ts">
import { reactive, ref } from "vue"
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import { ElMessage } from "element-plus"
import { Location } from "@element-plus/icons-vue"

defineOptions({ name: "DischargeEvents" })

// 查询表单
const searchForm = reactive({
  outletName: "",
  reportTime: [] as string[],
  eventType: "",
  eventLevel: ""
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    outletName: "鼓楼溪河排污口01",
    reportTime: "2025-02-01 16:25:25",
    eventType: "河道口有污水",
    eventLevel: "中等",
    location: "鼓楼区东大河西侧300m",
    latLong: "125°22'55,154°45'55"
  },
  {
    id: 2,
    outletName: "鼓楼溪河排污口01",
    reportTime: "2025-02-01 16:25:25",
    eventType: "河道口有污水",
    eventLevel: "中等",
    location: "鼓楼区东大河西侧300m",
    latLong: "125°22'55,154°45'55"
  },
  {
    id: 3,
    outletName: "鼓楼溪河排污口01",
    reportTime: "2025-02-01 16:25:25",
    eventType: "河道口有污水",
    eventLevel: "中等",
    location: "鼓楼区东大河西侧300m",
    latLong: "125°22'55,154°45'55"
  },
  {
    id: 4,
    outletName: "鼓楼溪河排污口01",
    reportTime: "2025-02-01 16:25:25",
    eventType: "河道口有污水",
    eventLevel: "中等",
    location: "鼓楼区东大河西侧300m",
    latLong: "125°22'55,154°45'55"
  }
])

const loading = ref(false)
const pagination = reactive({
  currentPage: 1,
  pageSize: 50,
  total: 0
})

// 选中行
const currentRow = ref<any>(tableData.value[2]) // 默认选中第三行用于展示效果

// 查询
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success("查询成功")
  }, 500)
}

// 清空
const handleReset = () => {
  searchForm.outletName = ""
  searchForm.reportTime = []
  searchForm.eventType = ""
  searchForm.eventLevel = ""
  handleSearch()
}

// 行点击事件
const handleRowClick = (row: any) => {
  currentRow.value = row
}

// 表格行样式
const tableRowClassName = ({ row }: { row: any }) => {
  if (currentRow.value && row.id === currentRow.value.id) {
    return 'current-row-highlight'
  }
  return ''
}

// 分页
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  handleSearch()
}
const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  handleSearch()
}

// 底部操作
const handleDispose = () => {
  ElMessage.info("点击了事件处置")
}

const handleRecord = () => {
  ElMessage.info("点击了流程记录")
}
</script>

<template>
  <div class="discharge-events-container">
    <SearchTableLayout>
      <template #searchSlot>
        <el-form :model="searchForm" :inline="true" class="search-form">
          <el-form-item label="排污口名称">
            <el-input v-model="searchForm.outletName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="上报时间">
            <el-date-picker
              v-model="searchForm.reportTime"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="事件类型">
            <el-input v-model="searchForm.eventType" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="事件等级">
            <el-input v-model="searchForm.eventLevel" placeholder="请输入" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">清空</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template #tableSlot>
        <div class="table-wrapper">
          <el-table
            :data="tableData"
            v-loading="loading"
            style="width: 100%"
            :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
            highlight-current-row
            @row-click="handleRowClick"
            :row-class-name="tableRowClassName"
          >
            <el-table-column prop="outletName" label="排污口名称" min-width="150" />
            <el-table-column prop="reportTime" label="上报时间" min-width="160" align="center" />
            <el-table-column prop="eventType" label="事件类型" min-width="120" align="center" />
            <el-table-column prop="eventLevel" label="事件等级" min-width="100" align="center" />
            <el-table-column prop="location" label="事件位置" min-width="200" align="center" />
            <el-table-column prop="latLong" label="经纬度" min-width="180" align="center" />
          </el-table>
          
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="pagination.currentPage"
              v-model:page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </template>
    </SearchTableLayout>

    <!-- 底部详细信息区域 -->
    <div class="details-section" v-if="currentRow">
      <div class="section-header">
        <span class="section-title">| 事件详细信息</span>
      </div>
      
      <div class="details-content">
        <!-- 左侧信息 -->
        <div class="info-panel">
          <div class="panel-header">详细信息</div>
          <div class="panel-body">
            <div class="info-row">
              <span class="info-value">{{ currentRow.eventType }}</span>
            </div>
            <!-- 这里可以根据实际需求添加更多字段 -->
          </div>
          <div class="panel-footer">
            <el-button type="primary" @click="handleDispose">事件处置</el-button>
            <el-button type="primary" @click="handleRecord">流程记录</el-button>
          </div>
        </div>

        <!-- 右侧地图 -->
        <div class="map-panel">
          <div class="panel-header">事件位置</div>
          <div class="map-container">
            <!-- 模拟地图图片，实际项目中可替换为 Cesium 或其他地图组件 -->
            <!-- <img 
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" 
              alt="Event Location Map" 
              class="map-image"
            /> -->
            <div class="map-marker">
               <el-icon :size="30" color="red"><Location /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.discharge-events-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  overflow: auto; // 允许整体滚动
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: 20px;
  }
}

.table-wrapper {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}

.pagination-container {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

// 自定义高亮行样式
:deep(.el-table .current-row-highlight) {
  background-color: #0095ff !important;
  color: #fff;
  
  // 保持选中行的 hover 样式一致，或者可以微调
  &:hover > td.el-table__cell {
    background-color: #0095ff !important;
  }
}

.details-section {
  margin: 16px 24px;
  
  .section-header {
    margin-bottom: 15px;
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      border-left: 4px solid #333;
      padding-left: 8px;
    }
  }

  .details-content {
    display: flex;
    gap: 20px;
    height: 400px;
  }
}

.info-panel, .map-panel {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  
  .panel-header {
    padding: 15px 20px;
    background-color: #f5f7fa;
    font-weight: bold;
    border-bottom: 1px solid #ebeef5;
  }
}

.info-panel {
  .panel-body {
    flex: 1;
    padding: 20px;
    
    .info-row {
      margin-bottom: 10px;
      .info-value {
        font-size: 14px;
        color: #333;
      }
    }
  }
  
  .panel-footer {
    padding: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid #ebeef5;
  }
}

.map-panel {
  .map-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    padding: 10px;
    
    .map-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }

    .map-marker {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -100%);
    }
  }
}
</style>
