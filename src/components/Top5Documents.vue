<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import * as echarts from 'echarts'
// import { top5Documents } from '../utils/mockData'
const props = defineProps({
  data: {
    type: Array,
    default: () => [] // 提供默认值，避免空数据问题
  }
})
// 直接使用 props.data，或者创建计算属性（如果需要处理数据）
const top5Documents = computed(() => {
  // 可以在这里对 props.data 进行处理，例如排序、过滤等
  return props.data
})
const chartRef = ref(null)
let chartInstance = null
const initChart = () => {
  // 修复：检查并销毁已有实例
  if (chartInstance) {
    chartInstance.dispose();
  }
  // 修复：使用getInstanceByDom复用已有实例
  chartInstance = echarts.getInstanceByDom(chartRef.value) || echarts.init(chartRef.value);

  const names = top5Documents.value.map(item => item.name)
  const counts = top5Documents.value.map(item => item.count)

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
onMounted(() => {
  initChart()
})

// 添加数据监听
watch(
  () => props.data,
  (newData) => {
    if (newData && newData.length) {
      initChart()  // 数据变化时重新初始化图表
    }
  },
  { deep: true }
)

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
