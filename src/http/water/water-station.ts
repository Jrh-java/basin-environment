import { request } from "@/http/axios"

export interface WaterStationQuery {
  stationName?: string
}

export interface WaterStationRow {
  id: string
  stationName: string
  stationCode: string
  administrativeRegion: string
  latLong: string
  networkStatus?: string
  delFlag?: string
}

export interface WaterStationListResponse {
  success: boolean
  message: string
  code: number
  result: WaterStationRow[]
}

export function getWaterStationList(params: WaterStationQuery): Promise<WaterStationListResponse> {
  return request<WaterStationListResponse>({
    url: "/water/waterStation/getList",
    method: "get",
    params
  })
}

export interface WaterStationSavePayload {
  stationName: string
  stationCode: string
  administrativeRegion: string
  latLong: string
  networkStatus?: string
  delFlag?: string
}

export interface WaterStationEditPayload extends WaterStationSavePayload {
  id: string
}

export function addWaterStation(data: WaterStationSavePayload) {
  return request({
    url: "/water/waterStation/add",
    method: "post",
    data
  })
}

export function editWaterStation(data: WaterStationEditPayload) {
  return request({
    url: "/water/waterStation/edit",
    method: "put",
    data
  })
}

export function deleteWaterStation(id: string) {
  return request({
    url: "/water/waterStation/delete",
    method: "delete",
    params: { id }
  })
}
