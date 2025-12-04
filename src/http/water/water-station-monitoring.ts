import { request } from "@/http/axios"

export interface WaterStationMonitoringQuery {
  page: number
  limit: number
  stationName?: string
}

export interface WaterStationMonitoringRow {
  stationId?: string | number
  stationName: string
  stationCode: string
  networkStatus?: string
  monitoringTime?: string
  dissolvedOxygenMgL?: number
  phValue?: number
  waterTemperature?: number
  permanganate?: number
  phosphorus?: number
  administrativeRegion?: string
  conductivity?: number
  turbidity?: number
  chlorophyllMgL?: number
  algaeDensityMgL?: number
  nitrogen?: number
  trend?: number[]
}

export interface PageEntityResult<T> {
  total: number
  records: T[]
}

export interface PageEntityResponse<T> {
  success: boolean
  message: string
  code: number
  result: PageEntityResult<T>
}

export function getWaterStationMonitoringPage(
  data: WaterStationMonitoringQuery
): Promise<PageEntityResponse<WaterStationMonitoringRow>> {
  return request<PageEntityResponse<WaterStationMonitoringRow>>({
    url: "/water/waterStationMonitoring/pageEntity",
    method: "post",
    data
  })
}

export interface WaterGroupHourItem {
  monitoringTime: string
  dissolvedOxygenMgL?: number
  phValue?: number
  waterTemperature?: number
  algaeDensityMgL?: number
  ammoniaNitrogenMgL?: number
  permanganate?: number
  phosphorus?: number
}

export interface WaterGroupHourResponse {
  success: boolean
  message: string
  code: number
  result: WaterGroupHourItem[]
}

export function getWaterGroupHour(stationId: string | number): Promise<WaterGroupHourResponse> {
  return request<WaterGroupHourResponse>({
    url: "/water/waterStationMonitoring/getWaterGroupHour",
    method: "get",
    params: { stationId }
  })
}
