export const MENU_DEFAULT_PARENT_ID = "-1"

export const MENU_TYPE_ENUM = {
  CATALOG: { value: "M", desc: "目录" },
  MENU: { value: "C", desc: "菜单" },
  POINTS: { value: "F", desc: "功能点" }
} as const

export const STATIC_MENU_DATA = [
  {
    id: "100",
    parentId: MENU_DEFAULT_PARENT_ID,
    menuName: "系统设置",
    menuType: MENU_TYPE_ENUM.CATALOG.value,
    icon: "Setting",
    url: "/系统设置",
    component: "",
    permission: "",
    status: "T",
    orderNum: 1,
    hasChildren: true,
    children: [
      {
        id: "101",
        parentId: "100",
        menuName: "菜单管理",
        menuType: MENU_TYPE_ENUM.MENU.value,
        icon: "Menu",
        url: "/系统设置/menu",
        component: "/pages/system/menu/menu-list.vue",
        permission: "system:menu",
        status: "T",
        orderNum: 1
      },
      {
        id: "102",
        parentId: "100",
        menuName: "角色管理",
        menuType: MENU_TYPE_ENUM.MENU.value,
        icon: "User",
        url: "/系统设置/role",
        component: "/pages/system/role/index.vue",
        permission: "system:role",
        status: "T",
        orderNum: 2
      }
    ]
  }
] as const
