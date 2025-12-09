<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import * as echarts from 'echarts'
// import { highFrequencyQuestions } from '../utils/mockData'

const props = defineProps({
  data: {
    type: Array,
    default: () => [] // 提供默认值，避免空数据问题
  }
})
// 监听父组件数据变化
const highFrequencyQuestions = computed(() => {
  return props.data
})
const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  // 检查并销毁已有实例
  if (chartInstance) {
    chartInstance.dispose();
  }
  // 使用getInstanceByDom复用已有实例
  chartInstance = echarts.getInstanceByDom(chartRef.value) || echarts.init(chartRef.value);
  let sortedData = []
  // 处理数据，按次数降序排列
  if (highFrequencyQuestions.value.length) {
    sortedData = [...highFrequencyQuestions.value].sort((a, b) => b.count - a.count)
  }
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
        formatter: function (value) {
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
  window.addEventListener('resize', handleResize)
}
onMounted(() => {
  initChart()
})

const handleResize = () => {
  chartInstance?.resize()
}
watch(
  () => props.data,
  (newData) => {
    if (newData && newData.length) {
      initChart()  // 数据变化时重新初始化图表
    }
  },
  { deep: true }
)
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
