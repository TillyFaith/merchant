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
import { zeroHitQuestions } from '../utils/mockData'

const tableData = zeroHitQuestions
</script>

<style scoped>
.question-content {
  white-space: normal;
  word-break: break-word;
}
</style>
