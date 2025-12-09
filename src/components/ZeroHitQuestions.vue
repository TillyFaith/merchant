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
import { ref, watch } from 'vue'
// import { zeroHitQuestions } from '../utils/mockData'
import { useDataVisualizationStore } from '@/stores/dataVisualization'
const dataVisualizationStore = useDataVisualizationStore()
// 添加默认值保护
const highFrequencyQuestions = ref(dataVisualizationStore.noHitData.value || [])
const tableData = ref([])

// 响应式监听数据变化
watch(
  () => dataVisualizationStore.noHitData.value,
  (newValue) => {
    const safeData = Array.isArray(newValue) ? newValue : []
    highFrequencyQuestions.value = safeData
    tableData.value = safeData.filter(item => item.count === 0)
  },
  { immediate: true }
)
</script>

<style scoped>
.question-content {
  white-space: normal;
  word-break: break-word;
}
</style>
