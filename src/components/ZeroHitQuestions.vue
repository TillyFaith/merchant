<template>
  <el-table :data="tableData" style="width: 100%" border>
    <el-table-column prop="id" label="ID" width="80" align="center" />
    <el-table-column prop="question" label="问题内容" min-width="300">
      <template #default="scope">
        <div class="question-content">{{ scope.row.question }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="count" label="咨询次数" width="120" align="center" />
    <el-table-column prop="time" label="首次出现时间" width="180" align="center" />
  </el-table>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  data: {
    type: Array,
    default: () => [] // 提供默认值，避免空数据问题
  }
})

// 直接使用 props.data，或者创建计算属性（如果需要处理数据）
const tableData = computed(() => {
  // 可以在这里对 props.data 进行处理，例如排序、过滤等
  return props.data
})

console.log(JSON.parse(JSON.stringify(tableData.value))) // 显示原始数组
</script>

<style scoped>
.question-content {
  white-space: normal;
  word-break: break-word;
}
</style>
