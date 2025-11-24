import { request } from "@/http/axios"

export interface AnnouncementItem {
  id: string
  noticeTitle: string
  noticeType?: string
  pushStartTime?: string
  pushEndTime?: string
  content?: string
  status?: string
}

export interface AnnouncementQuery {
  page: number
  limit: number
  noticeTitle?: string
  noticeType?: string
  pushStartTime?: string
  pushEndTime?: string
}

export interface PageResult<T> {
  list: T[]
  totalCount: number
}

export interface UserNoticeItem {
  userId: string
  userName: string
}

export interface UserNoticeStatus {
  userId: string
  userName: string
  status: string
}

export interface AnnouncementDetail extends AnnouncementItem {
  noticeContent?: string
  file?: string
  crtName?: string
  crtTime?: string
  userNoticeVOS?: UserNoticeStatus[]
}

export function getAnnouncementPageApi(params: AnnouncementQuery): Promise<ApiResponseData<PageResult<AnnouncementItem>>> {
  return request({
    url: "/authApi/reservoir/sys/announcement/getPage",
    method: "get",
    params
  })
}

export function deleteAnnouncementApi(ids: string[]) {
  return request({
    url: "/authApi/reservoir/sys/announcement/delete",
    method: "post",
    data: { ids }
  })
}

export function addAnnouncementApi(data: {
  noticeTitle: string
  noticeType: string
  noticeContent: string
  file?: string
  userNoticeList: UserNoticeItem[]
}) {
  return request({
    url: "/authApi/reservoir/sys/announcement/save",
    method: "post",
    data
  })
}

export function getAnnouncementDetailApi(id: string): Promise<ApiResponseData<AnnouncementDetail>> {
  return request({
    url: "/authApi/reservoir/sys/announcement/get",
    method: "get",
    params: { id }
  })
}
