<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
// import { top5Documents } from '../utils/mockData'
import { useDataVisualizationStore } from '@/stores/dataVisualization'



const chartRef = ref(null)
let chartInstance = null

const dataVisualizationStore = useDataVisualizationStore()
// 添加默认值保护
const top5Documents = ref(dataVisualizationStore.top5DocsData.value || [])

// 响应式监听数据变化
watch(
  () => dataVisualizationStore.top5DocsData.value,
  (newValue) => {
    top5Documents.value = Array.isArray(newValue) ? newValue : []
    initChart() // 数据变化时重新初始化图表
  },
  { immediate: true }
)

const initChart = () => {
  if (!chartRef.value || !top5Documents.value.length) return

  chartInstance = echarts.init(chartRef.value)
  if (!top5Documents) return
  const names = top5Documents.map(item => item.name)
  const counts = top5Documents.map(item => item.count)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c} 次引用'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: {
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: '引用次数'
    },
    series: [
      {
        name: '引用次数',
        type: 'bar',
        data: counts,
        itemStyle: {
          color: '#67c23a',
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: '#85ce61'
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)
  window.addEventListener('resize', handleResize)
}

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