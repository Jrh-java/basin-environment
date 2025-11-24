export interface LoginRequestData {
  username: string
  password: string
  verifyCode: string
  verifyKey: string
}

export type CaptchaResponseData = ApiResponseData<{ image: string, uuid: string }>

export type LoginResponseData = ApiResponseData<{
  token: string
  userId: string
  orgId: string
  username: string | null
  name: string
  roleId: string
}>
