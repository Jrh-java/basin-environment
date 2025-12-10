import type { CaptchaResponseData, LoginRequestData, LoginResponseData } from "@/pages/login/apis/type"
import { request } from "@/http/axios"

/**
 * 获取图形验证码
 */
export function getCaptchaApi(key: string) {
  return request<CaptchaResponseData>({
    url: `/sys/randomImage/${key}`,
    method: "get"
  })
}

/**
 * 登录接口
 * @param data {{username: string, password: string, captcha: string, checkKey: string}}
 */
export function loginApi(data: LoginRequestData) {
  return request<LoginResponseData>({
    url: "/sys/login",
    method: "post",
    data
  })
}

/**
 * 判断当前用户是否为管理员
 */
export function isCurrentUserAdmin() {
  return request<boolean>({
    url: "/sys/isCurrentUserAdminSign",
    method: "get"
  })
}

/**
 * 修改用户密码接口
 * @param data {{password: string, userIds: string[]}}
 */
export function updateUsersStatusOrPass(data: { password: string, userIds: string[] }) {
  return request({
    url: "authApi/reservoir/sys/sysAdminUser/updateUsersStatusOrPass",
    method: "post",
    data
  })
}
