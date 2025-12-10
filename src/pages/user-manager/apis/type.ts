export interface UserData {
  id: string
  username: string
  realname: string
  phone: string
  createBy: string
  createTime: string
  activitiSync: number
  userIdentity: number
  // Optional fields for UI logic or potential extra data
  nickname?: string
  email?: string
  status?: boolean
}

export interface UserPageResult {
  records: UserData[]
  total: number
  size: number
  current: number
}

export interface GetTableResponseData {
  success: boolean
  message: string
  code: number
  result: UserPageResult
}
