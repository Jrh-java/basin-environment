export type ColumnFormatter = (row: any, column: any, cellValue: any, index: number) => any

export interface ColumnDef {
  label: string
  prop: string
  align?: "left" | "center" | "right"
  fixed?: "left" | "right"
  width?: number
  formatter?: ColumnFormatter
}

export const columns: ColumnDef[] = [
  {
    label: "站点名称",
    align: "center",
    fixed: "left",
    prop: "stationName"
  },
  {
    label: "测站编码",
    align: "center",
    prop: "stationCode"

  },
  {
    label: "联网状态",
    align: "center",
    prop: "networkStatus",
    width: 100,
    formatter: (_, __, val) => (val === 1 || val === "1" ? "已连接" : "未连接")
  },
  {
    label: "监测时间",
    align: "center",
    prop: "monitoringTime"

  },
  {
    label: "溶解氧（mg/L）",
    align: "center",
    prop: "dissolvedOxygenMgL"
  },
  {
    label: "ph值",
    align: "center",
    prop: "phValue"
  },
  {
    label: "水温",
    align: "center",
    prop: "waterTemperature"
  },
  {
    label: "高锰酸盐",
    align: "center",
    prop: "permanganate"
  },
  {
    label: "总磷",
    align: "center",
    prop: "phosphorus"
  },
  {
    label: "氨氮（mg/L）",
    align: "center",
    prop: "ammoniaNitrogenMgL"
  },
  {
    label: "行政区划",
    align: "center",
    prop: "administrativeRegion"
  }

  // {
  //   label: "电导率",
  //   align: "center",
  //   prop: "conductivity"
  // },
  // {
  //   label: "浊度",
  //   align: "center",
  //   prop: "turbidity"
  // },
  // {
  //   label: "叶绿素（mg/L）",
  //   align: "center",
  //   prop: "chlorophyllMgL"
  // },
  // {
  //   label: "藻类密度（mg/L）",
  //   align: "center",
  //   prop: "algaeDensityMgL"
  // },
  // {
  //   label: "总氮",
  //   align: "center",
  //   prop: "nitrogen"
  // },

]
// 为所有没有 width 属性的列自动添加 width: 120
columns.forEach((col) => {
  if (col.width === undefined) {
    col.width = 120
  }
})
