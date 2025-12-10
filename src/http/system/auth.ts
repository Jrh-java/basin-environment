import type { CaptchaResponseData, LoginRequestData, LoginResponseData } from "@/pages/login/apis/type"
import { request } from "@/http/axios"

/**
 * 获取图形验证码
 */
export function getCaptchaApi() {
  return request<CaptchaResponseData>({
    url: "/authApi/reservoir/auth/captcha/getBase64",
    method: "get"
  })
}

/**
 * 登录接口
 * @param data {{username: string, password: string, verifyCode: string, verifyKey: string}}
 */
export function loginApi(data: LoginRequestData) {
  return request<LoginResponseData>({
    url: "/authApi/reservoir/auth/loginAuth/login",
    method: "post",
    data
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

/**
 * 判断当前用户是否为管理员
 */
export function isCurrentUserAdmin() {
  return request<ApiResponseData<boolean>>({
    url: "/sys/isCurrentUserAdminSign",
    method: "get"
  })
}
