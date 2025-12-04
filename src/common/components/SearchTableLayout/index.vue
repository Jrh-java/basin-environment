<script setup lang="ts">
defineOptions({ name: "SearchTableLayout" })
</script>

<template>
  <div class="search-table-layout">
    <section class="search-area">
      <slot name="searchSlot" />
    </section>
    <section class="table-area">
      <slot name="tableSlot" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.search-area {
  background-color: #ffffff;
  padding: 16px 24px;
  margin: 16px 24px 0 24px;
}
.table-area {
  margin: 5px 24px 0 24px;
}
</style>

<!--
用法说明：

<SearchTableLayout>
  <template #searchSlot>
    // 搜索区域内容（输入框、按钮等）
  </template>
  <template #tableSlot>
    // 表格区域内容（表格、分页等）
  </template>
</SearchTableLayout>

该组件仅提供样式与布局，不包含任何业务逻辑。
-->
