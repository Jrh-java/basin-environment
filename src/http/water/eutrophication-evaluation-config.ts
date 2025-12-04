import { request } from "@/http/axios"

export interface EutrophicationQuery {
  pageNo: number
  pageSize: number
  nutrientStatus?: string | number
}

export interface EutrophicationRecord {
  id: string
  nutrientStatus: string | number
  upperLimit: number | null
  lowerLimit: number | null
  remarks?: string | null
}

export interface EutrophicationPageData {
  records: EutrophicationRecord[]
  total?: number
  pages?: number
}

export interface EutrophicationPageResponse {
  success: boolean
  message: string
  code: number
  result: EutrophicationPageData
}

export function getEutrophicationEvaluationConfigPage(
  params: EutrophicationQuery
): Promise<EutrophicationPageResponse> {
  return request<EutrophicationPageResponse>({
    url: "/water/eutrophicationEvaluationConfig/pageEntity",
    method: "get",
    params
  })
}

export interface EutrophicationSavePayload {
  nutrientStatus: string | number
  upperLimit: number
  lowerLimit: number
  remarks?: string | null
}

export interface EutrophicationEditPayload extends EutrophicationSavePayload {
  id: string
}

export function addEutrophicationEvaluationConfig(data: EutrophicationSavePayload) {
  return request({
    url: "/water/eutrophicationEvaluationConfig/add",
    method: "post",
    data
  })
}

export function editEutrophicationEvaluationConfig(data: EutrophicationEditPayload) {
  return request({
    url: "/water/eutrophicationEvaluationConfig/edit",
    method: "put",
    data
  })
}

export function deleteEutrophicationEvaluationConfig(id: string) {
  return request({
    url: "/water/eutrophicationEvaluationConfig/delete",
    method: "delete",
    params: { id }
  })
}
