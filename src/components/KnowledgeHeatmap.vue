<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { knowledgeHeatmapData } from '../utils/mockData'

const chartRef = ref(null)
let chartInstance = null

onMounted(() => {
  // 初始化图表
  chartInstance = echarts.init(chartRef.value)

  // 处理数据
  const names = knowledgeHeatmapData.map(item => item.name)
  const counts = knowledgeHeatmapData.map(item => item.count)

  // 配置项
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
        interval: 0,
        rotate: 45,
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
          // 热力图颜色映射
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#ff6b6b' },
            { offset: 0.5, color: '#4ecdc4' },
            { offset: 1, color: '#45b7d1' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#ff5252' },
              { offset: 0.5, color: '#26a69a' },
              { offset: 1, color: '#29b6f6' }
            ])
          }
        }
      }
    ]
  }

  // 设置配置项
  chartInstance.setOption(option)

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  chartInstance?.resize()
}

onUnmounted(() => {
  // 销毁图表实例
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
