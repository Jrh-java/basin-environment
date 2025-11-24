import { request } from "@/http/axios"

export interface OperationLogQuery {
  page: number
  limit: number
  key?: string
  startTime?: string
  endTime?: string
}

export interface OperationLog {
  id: string
  userName?: string
  ip?: string
  params: string
  createTime?: string
}

export interface PageResult<T> {
  list: T[]
  totalCount: number
}

export function getOperationLogPage(params: OperationLogQuery): Promise<ApiResponseData<PageResult<OperationLog>>> {
  return request({
    url: "/authApi/reservoir/sys/operationLog/getPage",
    method: "get",
    params
  })
}

export function deleteOperationLog(ids: string[]) {
  return request({
    url: "/authApi/reservoir/sys/operationLog/delete",
    method: "post",
    data: { ids }
  })
}
