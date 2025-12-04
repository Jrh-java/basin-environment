import type { RouteRecordRaw } from "vue-router"
import { createRouter } from "vue-router"
import { routerConfig } from "@/router/config"
import { registerNavigationGuard } from "@/router/guard"
import { flatMultiLevelRoutes } from "./helper"

const Layouts = () => import("@/layouts/index.vue")

/**
 * @name 常驻路由
 * @description 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置唯一的 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: ":path(.*)",
        component: () => import("@/pages/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/pages/error/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/pages/error/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/pages/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/pages/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },

  {
    path: "/water-monitoring-system",
    component: Layouts,
    name: "WaterMonitoringSystem",
    meta: {
      title: "水环境监测系统",
      roles: []
    },
    redirect: "/realtime-monitoring/index",
    children: [
      {
        path: "/realtime-monitoring",
        component: () => import("@/pages/realtime-monitoring/wrapper.vue"),
        redirect: "/realtime-monitoring/index",
        name: "RealtimeMonitoring",
        meta: {
          title: "实时监测",
          roles: []
        },
        children: [
          {
            path: "index",
            component: () => import("@/pages/realtime-monitoring/index.vue"),
            name: "RealtimeMonitoringIndex",
            meta: {
              title: "实时监测",
              roles: []
            }
          }
        ]
      },
      {
        path: "/water-quality-assessment",
        component: () => import("@/pages/water-quality-assessment/wrapper.vue"),
        redirect: "/water-quality-assessment/standards",
        name: "WaterQualityAssessment",
        meta: {
          title: "水质评价",
          roles: []
        },
        children: [
          {
            path: "standards",
            component: () => import("@/pages/water-quality-assessment/standards/index.vue"),
            name: "WaterQualityStandards",
            meta: {
              title: "水质评价标准",
              roles: []
            }
          },
          {
            path: "eutrophication-standards",
            component: () => import("@/pages/water-quality-assessment/eutrophication-standards/index.vue"),
            name: "EutrophicationStandards",
            meta: {
              title: "富营养化标准",
              roles: []
            }
          }
        ]
      },
      {
        path: "/report-management",
        component: () => import("@/pages/report-management/wrapper.vue"),
        redirect: "/report-management/report-management",
        name: "ReportManagement",
        meta: {
          title: "报告管理",
          roles: []
        },
        children: [
          {
            path: "daily-report",
            component: () => import("@/pages/report-management/daily-report/index.vue"),
            name: "DailyReport",
            meta: {
              title: "水质日报",
              roles: []
            }
          },
          {
            path: "weekly-report",
            component: () => import("@/pages/report-management/weekly-report/index.vue"),
            name: "WeeklyReport",
            meta: {
              title: "水质周报",
              roles: []
            }
          },
          {
            path: "monthly-report",
            component: () => import("@/pages/report-management/monthly-report/index.vue"),
            name: "MonthlyReport",
            meta: {
              title: "水质月报",
              roles: []
            }
          },
          {
            path: "annual-report",
            component: () => import("@/pages/report-management/annual-report/index.vue"),
            name: "AnnualReport",
            meta: {
              title: "水质年报",
              roles: []
            }
          },
          {
            path: "report-management",
            component: () => import("@/pages/report-management/report-management/index.vue"),
            name: "ReportManagementMain",
            meta: {
              title: "报告管理",
              roles: []
            }
          }
        ]
      },
      {
        path: "/alarm-management",
        component: () => import("@/pages/alarm-management/wrapper.vue"),
        redirect: "/alarm-management/warning-info",
        name: "AlarmManagement",
        meta: {
          title: "报警处置",
          roles: []
        },
        children: [
          {
            path: "warning-info",
            component: () => import("@/pages/alarm-management/warning-info/index.vue"),
            name: "WarningInfo",
            meta: {
              title: "预警信息",
              roles: []
            }
          },
          {
            path: "warning-publish",
            component: () => import("@/pages/alarm-management/warning-publish/index.vue"),
            name: "WarningPublish",
            meta: {
              title: "预警发布",
              roles: []
            }
          },
          {
            path: "warning-push",
            component: () => import("@/pages/alarm-management/warning-push/index.vue"),
            name: "WarningPush",
            meta: {
              title: "预警推送",
              roles: []
            }
          },
          {
            path: "warning-settings",
            component: () => import("@/pages/alarm-management/warning-settings/index.vue"),
            name: "WarningSettings",
            meta: {
              title: "预警设置",
              roles: []
            }
          }
        ]
      }
    ]
  },
  {
    path: "/hydrological-monitoring-system",
    component: Layouts,
    name: "HydrologicalMonitoringSystem",
    meta: {
      title: "水文监测系统",
      roles: []
    },
    redirect: "/hydrological-monitoring-system/hydrological-monitoring",
    children: [
      {
        path: "hydrological-monitoring",
        component: () => import("@/pages/hydrological-monitoring-system/hydrological-monitoring/wrapper.vue"),
        name: "HydrologicalMonitoring",
        meta: {
          title: "水文监测",
          roles: []
        },
        redirect: "/hydrological-monitoring-system/hydrological-monitoring/water-level",
        children: [
          {
            path: "water-level",
            component: () => import("@/pages/hydrological-monitoring-system/hydrological-monitoring/water-level/index.vue"),
            name: "WaterLevel",
            meta: {
              title: "水情监测",
              roles: []
            }
          },
          {
            path: "rainfall",
            component: () => import("@/pages/hydrological-monitoring-system/hydrological-monitoring/rainfall/index.vue"),
            name: "Rainfall",
            meta: {
              title: "雨情监测",
              roles: []
            }
          },
          {
            path: "flow-rate",
            component: () => import("@/pages/hydrological-monitoring-system/hydrological-monitoring/flow-rate/index.vue"),
            name: "FlowRate",
            meta: {
              title: "流量监测",
              roles: []
            }
          }
        ]
      },
      {
        path: "monitoring-query",
        component: () => import("@/pages/hydrological-monitoring-system/monitoring-query/wrapper.vue"),
        name: "MonitoringQuery",
        meta: {
          title: "监测查询",
          roles: []
        },
        redirect: "/hydrological-monitoring-system/monitoring-query/water-level-query",
        children: [
          {
            path: "water-level-query",
            component: () => import("@/pages/hydrological-monitoring-system/monitoring-query/water-level-query/index.vue"),
            name: "WaterLevelQuery",
            meta: {
              title: "水情查询",
              roles: []
            }
          },
          {
            path: "rainfall-query",
            component: () => import("@/pages/hydrological-monitoring-system/monitoring-query/rainfall-query/index.vue"),
            name: "RainfallQuery",
            meta: {
              title: "雨情查询",
              roles: []
            }
          },
          {
            path: "flow-rate-query",
            component: () => import("@/pages/hydrological-monitoring-system/monitoring-query/flow-rate-query/index.vue"),
            name: "FlowRateQuery",
            meta: {
              title: "流量查询",
              roles: []
            }
          }
        ]
      },
      {
        path: "statistical-reports",
        component: () => import("@/pages/hydrological-monitoring-system/statistical-reports/wrapper.vue"),
        name: "StatisticalReports",
        meta: {
          title: "统计报表",
          roles: []
        },
        redirect: "/hydrological-monitoring-system/statistical-reports/report",
        children: [
          {
            path: "report",
            component: () => import("@/pages/hydrological-monitoring-system/statistical-reports/report/index.vue"),
            name: "StatisticalReport",
            meta: {
              title: "统计报表",
              roles: []
            }
          }
        ]
      }
    ]
  },
  {
    path: "/event-closed-loop-disposal",
    component: Layouts,
    name: "EventClosedLoopDisposal",
    meta: {
      title: "事件闭环处置",
      roles: []
    },
    redirect: "/event-closed-loop-disposal/comprehensive-monitoring/management-home",
    children: [
      {
        path: "comprehensive-monitoring",
        component: () => import("@/pages/event-closed-loop-disposal/comprehensive-monitoring/wrapper.vue"),
        name: "ComprehensiveMonitoring",
        meta: {
          title: "综合监控",
          roles: []
        },
        redirect: "/event-closed-loop-disposal/comprehensive-monitoring/management-home",
        children: [
          {
            path: "management-home",
            component: () => import("@/pages/event-closed-loop-disposal/comprehensive-monitoring/management-home/index.vue"),
            name: "ManagementHome",
            meta: {
              title: "管理首页",
              roles: []
            }
          },
          {
            path: "event-map",
            component: () => import("@/pages/event-closed-loop-disposal/comprehensive-monitoring/event-map/index.vue"),
            name: "EventMap",
            meta: {
              title: "事件地图",
              roles: []
            }
          }
        ]
      },
      {
        path: "event-disposal",
        component: () => import("@/pages/event-closed-loop-disposal/event-disposal/wrapper.vue"),
        name: "EventDisposal",
        meta: {
          title: "事件处置",
          roles: []
        },
        redirect: "/event-closed-loop-disposal/event-disposal/comprehensive-query",
        children: [
          {
            path: "comprehensive-query",
            component: () => import("@/pages/event-closed-loop-disposal/event-disposal/comprehensive-query/index.vue"),
            name: "ComprehensiveQuery",
            meta: {
              title: "综合查询",
              roles: []
            }
          },
          {
            path: "event-reporting",
            component: () => import("@/pages/event-closed-loop-disposal/event-disposal/event-reporting/index.vue"),
            name: "EventReporting",
            meta: {
              title: "事件填报",
              roles: []
            }
          },
          {
            path: "pending-events",
            component: () => import("@/pages/event-closed-loop-disposal/event-disposal/pending-events/index.vue"),
            name: "PendingEvents",
            meta: {
              title: "待办事件",
              roles: []
            }
          },
          {
            path: "executing-events",
            component: () => import("@/pages/event-closed-loop-disposal/event-disposal/executing-events/index.vue"),
            name: "ExecutingEvents",
            meta: {
              title: "执行中事件",
              roles: []
            }
          },
          {
            path: "supervision-events",
            component: () => import("@/pages/event-closed-loop-disposal/event-disposal/supervision-events/index.vue"),
            name: "SupervisionEvents",
            meta: {
              title: "督办事件",
              roles: []
            }
          },
          {
            path: "closed-events",
            component: () => import("@/pages/event-closed-loop-disposal/event-disposal/closed-events/index.vue"),
            name: "ClosedEvents",
            meta: {
              title: "结案事件",
              roles: []
            }
          }
        ]
      },
      {
        path: "event-evaluation-analysis",
        component: () => import("@/pages/event-closed-loop-disposal/event-evaluation-analysis/wrapper.vue"),
        name: "EventEvaluationAnalysisWrapper",
        meta: {
          title: "事件评价分析",
          roles: []
        },
        redirect: "/event-closed-loop-disposal/event-evaluation-analysis/evaluation-analysis",
        children: [
          {
            path: "evaluation-analysis",
            component: () => import("@/pages/event-closed-loop-disposal/event-evaluation-analysis/evaluation-analysis/index.vue"),
            name: "EvaluationAnalysis",
            meta: {
              title: "评价分析",
              roles: []
            }
          }
        ]
      }
    ]
  },
  {
    path: "/river-discharge-outlet-management",
    component: Layouts,
    name: "RiverDischargeOutletManagement",
    meta: {
      title: "入河排污口管理系统",
      roles: []
    },
    redirect: "/river-discharge-outlet-management/outlet-list",
    children: [
      {
        path: "outlet-list",
        component: () => import("@/pages/river-discharge-outlet-management/outlet-list/index.vue"),
        name: "OutletList",
        meta: {
          title: "入河排污口清单",
          roles: []
        }
      },
      {
        path: "discharge-events",
        component: () => import("@/pages/river-discharge-outlet-management/discharge-events/index.vue"),
        name: "DischargeEvents",
        meta: {
          title: "入河排污事件",
          roles: []
        }
      },
      {
        path: "query-stats",
        component: () => import("@/pages/river-discharge-outlet-management/query-stats/index.vue"),
        name: "QueryStats",
        meta: {
          title: "查询统计",
          roles: []
        }
      }
    ]
  },
  {
    path: "/pollution-source-control-system",
    component: Layouts,
    name: "PollutionSourceControlSystem",
    meta: {
      title: "污染源管控系统",
      roles: []
    },
    redirect: "/pollution-source-control-system/basic-info",
    children: [
      {
        path: "basic-info",
        component: () => import("@/pages/PollutionSourceControlSystem/BasicInfo.vue"),
        name: "BasicInfo",
        meta: {
          title: "污染源基本信息",
          roles: []
        }
      },
      {
        path: "monitoring-analysis",
        component: () => import("@/pages/PollutionSourceControlSystem/MonitoringAnalysis.vue"),
        name: "MonitoringAnalysis",
        meta: {
          title: "污染源监测分析",
          roles: []
        }
      },
      {
        path: "traceability-analysis",
        component: () => import("@/pages/PollutionSourceControlSystem/TraceabilityAnalysis.vue"),
        name: "TraceabilityAnalysis",
        meta: {
          title: "污染溯源分析",
          roles: []
        }
      }
    ]
  }
  //   {
  //   path: "/system",
  //   component: Layouts,
  //   redirect: "/system/main",
  //   name: "System",
  //   meta: {
  //     title: "系统设置",
  //     elIcon: "Setting"
  //   },
  //   children: [
  //     {
  //       path: "main",
  //       component: () => import("@/pages/system/index.vue"),
  //       name: "SystemMain",
  //       meta: {
  //         title: "系统设置首页"
  //       }
  //     },
  //     {
  //       path: "department",
  //       component: () => import("@/pages/system/department/index.vue"),
  //       name: "Department",
  //       meta: {
  //         title: "部门管理"
  //       }
  //     },
  //     {
  //       path: "employee",
  //       component: () => import("@/pages/system/employee/index.vue"),
  //       name: "Employee",
  //       meta: {
  //         title: "员工管理"
  //       }
  //     },
  //     {
  //       path: "menu",
  //       component: () => import("@/pages/system/menu/menu-list.vue"),
  //       name: "MenuList",
  //       meta: {
  //         title: "菜单管理"
  //       }
  //     },
  //     {
  //       path: "position",
  //       component: () => import("@/pages/system/position/index.vue"),
  //       name: "Position",
  //       meta: {
  //         title: "职务管理"
  //       }
  //     },
  //     {
  //       path: "role",
  //       component: () => import("@/pages/system/role/index.vue"),
  //       name: "Role",
  //       meta: {
  //         title: "角色管理"
  //       }
  //     },
  //     {
  //       path: "change-password",
  //       component: () => import("@/pages/system/change-password/changepassword.vue"),
  //       name: "ChangePassword",
  //       meta: {
  //         title: "修改密码"
  //       }
  //     },
  //     {
  //       path: "announcement",
  //       component: () => import("@/pages/system/announcement.vue"),
  //       name: "Announcement",
  //       meta: {
  //         title: "系统公告"
  //       }
  //     },
  //     {
  //       path: "operation-log",
  //       component: () => import("@/pages/system/operation-log.vue"),
  //       name: "OperationLog",
  //       meta: {
  //         title: "操作日志"
  //       }
  //     }
  //   ]
  // }
]

/**
 * @name 动态路由
 * @description 用来放置有权限 (Roles 属性) 的路由
 * @description 必须带有唯一的 Name 属性
 */
export const dynamicRoutes: RouteRecordRaw[] = [

]

/** 路由实例 */
export const router = createRouter({
  history: routerConfig.history,
  routes: routerConfig.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  try {
    // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    location.reload()
  }
}

// 注册路由导航守卫
registerNavigationGuard(router)
