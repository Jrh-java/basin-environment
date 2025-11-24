<!--
  * 菜单 表单 树形下拉框
  *
  * @Author:    1024创新实验室-主任：卓大
  * @Date:      2022-06-12 20:11:39
  * @Wechat:    zhuda1024
  * @Email:     lab1024@163.com
  * @Copyright  1024创新实验室 （ https://1024lab.net ），Since 2012
-->
<script setup>
import { cloneDeep } from "lodash-es"
import { onMounted, ref } from "vue"
import { MENU_TYPE_ENUM, STATIC_MENU_DATA } from "@/constants/menu-const"
// 调整接口引用到 http/system，统一系统模块接口入口
import * as menuApi from "@/http/system/menu"
// 移除对旧 Store 的依赖，改为直接调用接口

const props = defineProps({
  value: [String, Number]
})

const emit = defineEmits(["update:value"])

const treeData = ref([])

// 过滤掉按钮类型的菜单，只显示目录和菜单
function filterMenuTree(menuList) {
  return menuList.filter((menu) => {
    // 过滤掉按钮类型
    if (menu.menuType === MENU_TYPE_ENUM.POINTS.value) {
      return false
    }

    // 如果有子菜单，递归过滤
    if (menu.children && menu.children.length > 0) {
      menu.children = filterMenuTree(menu.children)
    }

    return true
  })
}

async function queryMenuTree() {
  try {
    try {
      const res = await menuApi.queryMenuTree({
        key: "",
        menuType: "", // 不限制类型，在本地过滤
        status: "T" // 只获取启用的菜单
      })

      if (res?.data && res.data.length > 0) {
        treeData.value = filterMenuTree(cloneDeep(res.data))
      } else {
        treeData.value = filterMenuTree(cloneDeep(STATIC_MENU_DATA))
      }
    } catch (apiError) {
      console.warn("API调用失败，使用静态菜单数据:", apiError)
      treeData.value = filterMenuTree(cloneDeep(STATIC_MENU_DATA))
    }
  } catch {
    console.error("查询菜单树失败")
    treeData.value = filterMenuTree(cloneDeep(STATIC_MENU_DATA))
  }
}

onMounted(queryMenuTree)

function treeSelectChange(value) {
  emit("update:value", value)
}

defineExpose({
  queryMenuTree
})
</script>

<template>
  <el-tree-select
    :model-value="props.value"
    :data="treeData"
    :props="{ label: 'menuName', children: 'children', value: 'id' }"
    filterable
    :teleported="false"
    class="menu-tree-select"
    placeholder="请选择菜单"
    clearable
    check-strictly
    default-expand-all
    @change="treeSelectChange"
  />
</template>

<style lang="scss" scoped>
.custom-tree-select .el-tree-node__label {
  text-align: left;
}
</style>
