<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

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

// 定义颜色数组
const colors = ['#67c23a', '#e6a23c', '#f56c6c', '#909399', '#409eff', '#36cfc9', '#fcc419', '#722ed1']

// 将扁平数据转换为树图所需的层级数据格式，并为每个节点分配颜色
const transformToTreeData = (data) => {
  return {
    name: '文档引用',
    children: data.map((item, index) => ({
      name: item.name,
      value: item.count,
      itemStyle: {
        color: colors[index % colors.length] // 为每个节点分配颜色
      }
    }))
  }
}

const initChart = () => {
  // 修复：检查并销毁已有实例
  if (chartInstance) {
    chartInstance.dispose();
  }
  // 修复：使用getInstanceByDom复用已有实例
  chartInstance = echarts.getInstanceByDom(chartRef.value) || echarts.init(chartRef.value);

  const treeData = transformToTreeData(top5Documents.value)

  const option = {
    tooltip: {
      formatter: '{b}: {c} 次引用'
    },
    series: [
      {
        name: '文档引用',
        type: 'treemap',
        data: [treeData],
        roam: false, // 禁用缩放和平移
        label: {
          show: true,
          formatter: '{b}',
          fontSize: 12
        },
        itemStyle: {
          borderColor: '#fff'
        },
        emphasis: {
          itemStyle: {
            borderWidth: 2
          },
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        levels: [
          {
            itemStyle: {
              borderWidth: 0,
              gapWidth: 5
            }
          },
          {
            itemStyle: {
              gapWidth: 1
            }
          }
        ]
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
  async (newData) => {
    if (newData && newData.length) {
      await nextTick()
      initChart()
    }
  },
  { deep: true, immediate: false } // 关闭immediate，避免初始无数据时执行
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
