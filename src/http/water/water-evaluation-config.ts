import { request } from "@/http/axios"

export interface WaterEvaluationConfigQuery {
  pageNo: number
  pageSize: number
  waterQualityGrade?: string | number
}

export interface WaterEvaluationConfigRecord {
  id: string
  parameterName: string
  waterQualityLevel: string
  upperLimit: number | null
  lowerLimit: number | null
  remarks?: string | null
}

export interface WaterEvaluationConfigPageData {
  records: WaterEvaluationConfigRecord[]
  total?: number
  pages?: number
}

export interface WaterEvaluationConfigPageResponse {
  success: boolean
  message: string
  code: number
  result: WaterEvaluationConfigPageData
}

export function getWaterEvaluationConfigPage(
  params: WaterEvaluationConfigQuery
): Promise<WaterEvaluationConfigPageResponse> {
  return request<WaterEvaluationConfigPageResponse>({
    url: "/water/waterEvaluationConfig/pageEntity",
    method: "get",
    params
  })
}

export interface WaterEvaluationSavePayload {
  parameterName: string
  waterQualityLevel: string | number
  upperLimit: number
  lowerLimit: number
  remarks?: string | null
}

export interface WaterEvaluationEditPayload extends WaterEvaluationSavePayload {
  id: string
}

export function addWaterEvaluationConfig(data: WaterEvaluationSavePayload) {
  return request({
    url: "/water/waterEvaluationConfig/add",
    method: "post",
    data
  })
}

export function editWaterEvaluationConfig(data: WaterEvaluationEditPayload) {
  return request({
    url: "/water/waterEvaluationConfig/edit",
    method: "put",
    data
  })
}

export function deleteWaterEvaluationConfig(id: string) {
  return request({
    url: "/water/waterEvaluationConfig/delete",
    method: "delete",
    params: { id }
  })
}
