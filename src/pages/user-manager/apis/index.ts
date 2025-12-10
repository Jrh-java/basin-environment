import type * as User from "./type"
import { request } from "@/http/axios"

/** 获取用户列表 */
export function getUserListApi(params: any) {
  return request<User.GetTableResponseData>({
    url: "/sys/user/listAll",
    method: "get",
    params
  })
}

/** 新增用户 */
export function addUserApi(data: any) {
  return request({
    url: "/sys/user/add",
    method: "post",
    data
  })
}

/** 修改用户 */
export function updateUserApi(data: any) {
  return request({
    url: "/sys/user/edit",
    method: "put",
    data
  })
}

/** 修改密码 */
export function changePasswordApi(data: any) {
  return request({
    url: "/sys/user/changePassword",
    method: "put",
    data
  })
}

/** 删除用户 */
export function deleteUserApi(id: string) {
  return request({
    url: "/sys/user/delete",
    method: "delete",
    params: { id }
  })
}
