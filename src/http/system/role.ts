import { request } from "@/http/axios"

// 角色接口类型定义
export interface Role {
  id?: string
  roleName: string
  roleCode?: string
  description?: string
  status: string
  crtTime?: string
  crtUser?: string
  crtName?: string
  updTime?: string
  updUser?: string
  updName?: string
  membersNum?: number
}

export interface User {
  userId: string
  userName: string
  name: string
  email?: string
  mobilePhone?: string
  telPhone?: string
  deptId?: string
  status: string
  isActive?: string
  address?: string
  birthday?: string
  sex?: string
  description?: string
  remark?: string
}

export interface MenuTreeNode {
  id: string
  parentId: string
  menuName: string
  menuCode?: string
  menuType: string
  url?: string
  component?: string
  permission?: string
  icon?: string
  status: string
  children?: MenuTreeNode[]
}

export interface RoleMenuResponse {
  roleId: string
  menuTreeVOS: MenuTreeNode[]
  selectedMenuIds: string[]
}

// 保存角色
export function saveRole(params: {
  roleName: string
  description?: string
  status: string
}) {
  return request({
    url: "/authApi/reservoir/sys/sysRole/save",
    method: "post",
    data: params
  })
}

// 更新角色
export function updateRole(params: {
  id: string
  roleName: string
  description?: string
  status: string
}) {
  return request({
    url: "/authApi/reservoir/sys/sysRole/update",
    method: "post",
    data: params
  })
}

// 更新角色权限
export function updateRoleMenu(params: {
  roleId: string
  menuIdList: string[]
}) {
  return request({
    url: "/authApi/reservoir/sys/sysRole/updateRoleMenu",
    method: "post",
    data: params
  })
}

// 删除角色
export function deleteRole(ids: string[]) {
  return request({
    url: "/authApi/reservoir/sys/sysRole/delete",
    method: "post",
    data: { ids }
  })
}

// 根据角色ID获取用户列表
export function getUsersByRoleId(roleId: string) {
  const formData = new FormData()
  formData.append("roleId", roleId)
  return request({
    url: "/authApi/reservoir/sys/sysRole/getUsersByRoleId",
    method: "get",
    params: { roleId }
  })
}

// 获取所有角色
export function getAllRole(): Promise<ApiResponseData<Role[]>> {
  return request({
    url: "/authApi/reservoir/sys/sysRole/getAllRole",
    method: "get"
  })
}

// 获取角色关联的权限菜单
export function getRoleSelectedMenu(roleId: string): Promise<ApiResponseData<RoleMenuResponse>> {
  return request({
    url: "/authApi/reservoir/sys/sysRole/getRoleSelectedMenu",
    method: "get",
    params: { roleId }
  })
}
