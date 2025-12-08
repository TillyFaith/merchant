// Import ref from Vue instead of Pinia
import { ref } from 'vue'
import { defineStore } from 'pinia'
// 替换：导入新的API接口
import { getHeatmapData, getTop10Data, getNoHitData, getTop5RefData } from '@/utils/api'

export const useDataVisualizationStore = defineStore('dataVisualization', () => {
  const heatmapData = ref([])
  const top10Data = ref([])
  // 新增：热门文档数据状态
  const top5DocsData = ref([])
  const noHitData = ref([])
  // 删除：移除未使用的trendData
  const isLoading = ref(false)

  const fetchVisualizationData = async () => {
    isLoading.value = true
    try {
      // 并行请求所有数据接口
      const [heatmapRes, top10Res, noHitRes, top5DocsRes] = await Promise.all([
        getHeatmapData(),
        getTop10Data(),
        getNoHitData(),
        getTop5RefData(),
      ])
      // 分别赋值各数据集
      heatmapData.value = heatmapRes.data
      top10Data.value = top10Res.data
      noHitData.value = noHitRes.data
      top5DocsData.value = top5DocsRes.data
    } catch (error) {
      console.error('Failed to fetch visualization data:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    heatmapData,
    top10Data,
    noHitData,
    top5DocsData, // 新增：热门文档数据
    isLoading,
    fetchVisualizationData,
  }
})
