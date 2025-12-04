# SearchTableLayout 使用规范

该组件用于统一页面的「搜索区域 + 表格区域」布局样式，无业务逻辑，仅提供样式与结构封装。

## 组件位置

- 路径：`src/common/components/SearchTableLayout/index.vue`

## 使用约定

- 所有包含「搜索 + 表格」的页面必须使用该组件包裹布局
- 搜索区域内容通过 `searchSlot` 插槽传入
- 表格区域内容（含分页等）通过 `tableSlot` 插槽传入

## 示例

```vue
<SearchTableLayout>
  <template #searchSlot>
    <el-input v-model="keyword" placeholder="请输入关键字" />
    <el-button type="primary" @click="onSearch">搜索</el-button>
  </template>

  <template #tableSlot>
    <el-table :data="list">
      <!-- ...columns -->
    </el-table>
    <el-pagination :total="total" />
  </template>
</SearchTableLayout>
```

## 样式规范

- 搜索区域：背景 `#FFFFFF`；`padding: 16px 24px`
- 表格区域：`margin: 16px 24px 0 24px`

## 注意事项

-- 组件只负责样式与布局，不处理任何数据或交互逻辑

- 保持与项目设计系统一致的间距与配色
