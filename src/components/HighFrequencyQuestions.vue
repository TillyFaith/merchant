<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
// import { highFrequencyQuestions } from '../utils/mockData'
import { useDataVisualizationStore } from '@/stores/dataVisualization'
const dataVisualizationStore = useDataVisualizationStore()
// 添加默认值保护
const highFrequencyQuestions = ref(dataVisualizationStore.top10Data.value || [])

// 移动initChart函数到watch监听器之前
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  // 处理数据，按次数降序排列
  const sortedData = [...highFrequencyQuestions.value].sort((a, b) => b.count - a.count)
  const questions = sortedData.map(item => item.question)
  const counts = sortedData.map(item => item.count)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c} 次咨询'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '咨询次数'
    },
    yAxis: {
      type: 'category',
      data: questions,
      axisLabel: {
        fontSize: 12,
        width: 150,
        overflow: 'break',
        formatter: function(value) {
          return value.length > 15 ? value.substring(0, 15) + '...' : value;
        }
      }
    },
    series: [
      {
        name: '咨询次数',
        type: 'bar',
        data: counts,
        itemStyle: {
          color: '#409eff',
          borderRadius: [0, 4, 4, 0]
        },
        emphasis: {
          itemStyle: {
            color: '#66b1ff'
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)
  const resizeHandler = () => {
    chartInstance.resize()
  }
  window.addEventListener('resize', resizeHandler)
  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler)
    chartInstance.dispose()
  })
}

// 响应式监听数据变化
watch(
  () => dataVisualizationStore.top10Data.value,
  (newValue) => {
    highFrequencyQuestions.value = Array.isArray(newValue) ? newValue : []
    initChart() // 现在initChart已定义，可以正常调用
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('resize', handleResize)
  initChart() // 初始调用
})

const handleResize = () => {
  chartInstance?.resize()
}

onUnmounted(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
