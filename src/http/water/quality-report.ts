import { request } from "@/http/axios"

export interface QualityReportQuery {
  page: number
  limit: number
  sectionName?: string
  beginTime: string
  endTime: string
  selectType: 1 | 2 | 3 | 4
}

export interface QualityReportRow {
  sectionName: string
  stationCode: string
  riverName: string
  monitoringParam: string
  sectionFunction: string
  sectionType: string
  waterQualityLevel: string | number
  monitoringTime: string
  chainRatio?: string | number
}

export interface QualityReportPageEntity {
  total: number
  records: QualityReportRow[]
}

export interface QualityReportListResponse {
  success: boolean
  message: string
  code: number
  result: QualityReportPageEntity
}

export function getQualityReportList(
  data: QualityReportQuery
): Promise<QualityReportListResponse> {
  return request<QualityReportListResponse>({
    url: "/water/qualityReport/list",
    method: "post",
    data
  })
}
