<script setup lang="ts">
import { reactive, ref } from "vue"
import SearchTableLayout from "@@/components/SearchTableLayout/index.vue"
import { ElMessage } from "element-plus"
import { Location } from "@element-plus/icons-vue"

defineOptions({ name: "BasicInfo" })

// 查询表单
const searchForm = reactive({
  sourceName: "",
  region: "",
  timeRange: [] as string[]
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    sourceName: "鼓楼溪河排污口01",
    envType: "工厂",
    manageProp: "县管",
    productInfo: "中等",
    warningInfo: "氨氮≥1.2",
    location: "鼓楼区东大河西侧300m"
  },
  {
    id: 2,
    sourceName: "鼓楼溪河排污口01",
    envType: "生活污水",
    manageProp: "县管",
    productInfo: "中等",
    warningInfo: "氨氮≥1.2",
    location: "鼓楼区东大河西侧300m"
  },
  {
    id: 3,
    sourceName: "鼓楼溪河排污口01",
    envType: "医院",
    manageProp: "县管",
    productInfo: "中等",
    warningInfo: "氨氮≥1.2",
    location: "鼓楼区东大河西侧300m"
  },
  {
    id: 4,
    sourceName: "鼓楼溪河排污口01",
    envType: "工厂",
    manageProp: "乡镇",
    productInfo: "中等",
    warningInfo: "氨氮≥1.2",
    location: "鼓楼区东大河西侧300m"
  }
])

const loading = ref(false)
const pagination = reactive({
  currentPage: 1,
  pageSize: 50,
  total: 0
})

// 选中行
const currentRow = ref<any>(tableData.value[2])

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
  searchForm.sourceName = ""
  searchForm.region = ""
  searchForm.timeRange = []
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

</script>

<template>
  <div class="basic-info-container">
    <SearchTableLayout>
      <template #searchSlot>
        <el-form :model="searchForm" :inline="true" class="search-form">
          <el-form-item label="污染源名称">
            <el-input v-model="searchForm.sourceName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="区域选择">
            <el-input v-model="searchForm.region" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="时间选择">
            <el-date-picker
              v-model="searchForm.timeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 240px"
            />
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
            <el-table-column prop="sourceName" label="污染源名称" min-width="150" />
            <el-table-column prop="envType" label="环境类型" min-width="120" align="center" />
            <el-table-column prop="manageProp" label="管理属性" min-width="120" align="center" />
            <el-table-column prop="productInfo" label="产品信息" min-width="120" align="center" />
            <el-table-column prop="warningInfo" label="预警信息" min-width="150" align="center" />
            <el-table-column prop="location" label="污染源位置" min-width="200" align="center" />
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
        <span class="section-title">| 污染源详细信息</span>
      </div>
      
      <div class="details-content">
        <!-- 左侧信息 -->
        <div class="info-panel">
          <div class="panel-header">详细信息</div>
          <div class="panel-body">
             <div class="info-row">
               <span class="info-value">西河河污水处理厂</span>
             </div>
          </div>
        </div>

        <!-- 右侧地图 -->
        <div class="map-panel">
          <div class="panel-header">污染源位置</div>
          <div class="map-container">
            <!-- <img 
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" 
              alt="Location Map" 
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
.basic-info-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  overflow: auto;
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

:deep(.el-table .current-row-highlight) {
  background-color: #0095ff !important;
  color: #fff;
  
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
    height: 300px;
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
    .info-value {
      font-size: 14px;
      color: #333;
    }
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
