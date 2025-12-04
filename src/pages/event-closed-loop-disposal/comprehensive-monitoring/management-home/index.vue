<script setup lang="ts">
import * as echarts from "echarts"
import { onMounted, onUnmounted, ref } from "vue"

defineOptions({ name: "ManagementHome" })

// --- 统计数据 ---
const stats = [
  { title: "待办事件", value: 45, color: "#409EFF" },
  { title: "执行中事件", value: 27, color: "#E6A23C" },
  { title: "督办事件", value: 3, color: "#F56C6C" },
  { title: "结案事件", value: 127, color: "#67C23A" }
]

// --- 图表引用 ---
const barChartRef = ref<HTMLElement | null>(null)
const pieChartRef = ref<HTMLElement | null>(null)
let barChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null

// --- 反馈列表数据 ---
const feedbackList = ref([
  { id: 1, user: "纣王", content: "西湖报警站监测线路故障", time: "2025-02-02", avatar: "" },
])

// --- 初始化图表 ---
function initCharts() {
  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value)
    barChart.setOption({
      tooltip: { trigger: "axis" },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: {
        type: "category",
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        axisTick: { alignWithLabel: true }
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "事件数量",
          type: "bar",
          barWidth: "40%",
          data: [10, 52, 200, 334, 390, 330, 220],
          itemStyle: { color: "#409EFF" }
        }
      ]
    })
  }

  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption({
      tooltip: { trigger: "item" },
      legend: { top: "5%", left: "center" },
      series: [
        {
          name: "事件类型",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2
          },
          label: { show: false, position: "center" },
          emphasis: {
            label: { show: true, fontSize: 20, fontWeight: "bold" }
          },
          labelLine: { show: false },
          data: [
            { value: 1048, name: "类型1" },
            { value: 735, name: "类型2" },
            { value: 580, name: "类型3" },
            { value: 484, name: "类型4" },
            { value: 300, name: "类型5" }
          ]
        }
      ]
    })
  }
}

// --- 响应式调整 ---
function resizeCharts() {
  barChart?.resize()
  pieChart?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener("resize", resizeCharts)
})

onUnmounted(() => {
  window.removeEventListener("resize", resizeCharts)
  barChart?.dispose()
  pieChart?.dispose()
})
</script>

<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <!-- 左侧主要区域 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="17" :xl="18">
        <!-- 顶部统计面板 -->
        <div class="stats-panel">
          <el-row :gutter="20">
            <el-col v-for="item in stats" :key="item.title" :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-content">
                  <div class="stat-title">
                    {{ item.title }}
                  </div>
                  <div class="stat-value" :style="{ color: item.color }">
                    {{ item.value }}
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 中部图表区域 -->
        <div class="charts-panel">
          <el-row :gutter="20">
            <!-- 处置时效专题图 -->
            <el-col :xs="24" :sm="24" :md="12">
              <el-card shadow="hover" class="chart-card">
                <template #header>
                  <div class="card-header">
                    <span class="header-title">| 处置时效专题图</span>
                  </div>
                </template>
                <div ref="barChartRef" class="chart-container" />
              </el-card>
            </el-col>
            <!-- 事件类型分布图 -->
            <el-col :xs="24" :sm="24" :md="12">
              <el-card shadow="hover" class="chart-card">
                <template #header>
                  <div class="card-header">
                    <span class="header-title">| 事件类型分布图</span>
                  </div>
                </template>
                <div ref="pieChartRef" class="chart-container" />
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>

      <!-- 右侧区域 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="7" :xl="6">
        <!-- 事件热力图 -->
        <el-card shadow="hover" class="right-card heatmap-card">
          <template #header>
            <div class="card-header">
              <span class="header-title">| 事件热力图</span>
            </div>
          </template>
          <div class="heatmap-placeholder">
            <span class="placeholder-text">热力图预留区域</span>
          </div>
        </el-card>

        <!-- 事件反馈 -->
        <el-card shadow="hover" class="right-card feedback-card">
          <template #header>
            <div class="card-header">
              <span class="header-title">| 事件反馈</span>
            </div>
          </template>
          <div class="feedback-list">
            <div v-for="item in feedbackList" :key="item.id" class="feedback-item">
              <div class="item-avatar">
                <el-avatar :size="40" icon="UserFilled">{{ item.user.charAt(0) }}</el-avatar>
              </div>
              <div class="item-info">
                <div class="info-header">
                  <span class="user-name">{{ item.user }}</span>
                  <span class="time">{{ item.time }}</span>
                </div>
                <div class="info-content">
                  {{ item.content }}
                </div>
              </div>
            </div>
          </div>
          <!-- 分页（简化版） -->
          <div class="pagination-wrapper">
            <el-pagination small layout="prev, pager, next" :total="50" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.dashboard-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);

  .stats-panel {
    margin-bottom: 20px;

    .stat-card {
      text-align: center;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .stat-title {
        font-size: 14px;
        color: #606266;
        margin-bottom: 10px;
      }

      .stat-value {
        font-size: 24px;
        font-weight: bold;
      }
    }
  }

  .charts-panel {
    .chart-card {
      margin-bottom: 20px;
      border-radius: 8px;

      .chart-container {
        height: 420px;
        width: 100%;
      }
    }
  }

  .right-card {
    margin-bottom: 20px;
    border-radius: 8px;

    &.heatmap-card {
      .heatmap-placeholder {
        height: 250px;
        background-color: #eef5fe;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        border: 2px dashed #dcdfe6;

        .placeholder-text {
          color: #909399;
          font-size: 14px;
        }
      }
    }

    &.feedback-card {
      .feedback-list {
        min-height: 130px;
      }

      .feedback-item {
        display: flex;
        padding: 12px 0;
        border-bottom: 1px solid #ebeef5;

        &:last-child {
          border-bottom: none;
        }

        .item-avatar {
          margin-right: 12px;
        }

        .item-info {
          flex: 1;

          .info-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;

            .user-name {
              font-weight: bold;
              color: #303133;
              font-size: 14px;
            }

            .time {
              color: #909399;
              font-size: 12px;
            }
          }

          .info-content {
            color: #606266;
            font-size: 13px;
            line-height: 1.4;
          }
        }
      }

      .pagination-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 15px;
      }
    }
  }

  .card-header {
    display: flex;
    align-items: center;

    .header-title {
      font-weight: bold;
      font-size: 16px;
      color: #303133;
      position: relative;
      
      /* 模拟竖线样式 */
      &::before {
        /* content: ""; */
        /* 既然文字里已经写了 | ，这里就不需要伪元素了，或者可以用 css border-left 实现更标准的竖线 */
      }
    }
  }
}

/* 响应式适配 */
@media screen and (max-width: 992px) {
  .dashboard-container {
    .charts-panel {
      .el-col {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
