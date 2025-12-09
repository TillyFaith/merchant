// Import ref from Vue instead of Pinia
import { ref } from 'vue'
import { defineStore } from 'pinia'
// 替换：导入新的API接口
import { getTop10Data, getNoHitData, getTop5RefData } from '@/utils/api'

export const useDataVisualizationStore = defineStore('dataVisualization', () => {
  // const heatmapData = ref([])
  const top10Data = ref([])
  // 新增：热门文档数据状态
  const top5DocsData = ref([])
  const noHitData = ref([])
  // 删除：移除未使用的trendData
  const isLoading = ref(false)

  const fetchVisualizationData = async () => {
    isLoading.value = true
    try {
      const [top10Res, noHitRes, top5DocsRes] = await Promise.all([
        getTop10Data(),
        getNoHitData(),
        getTop5RefData(),
      ])
      // 添加数据验证
      top10Data.value = Array.isArray(top10Res.data) ? top10Res.data : []
      noHitData.value = Array.isArray(noHitRes.data) ? noHitRes.data : []
      top5DocsData.value = Array.isArray(top5DocsRes.data) ? top5DocsRes.data : []
    } catch (error) {
      console.error('Failed to fetch visualization data:', error)
      // 错误时确保状态为数组
      top10Data.value = []
      noHitData.value = []
      top5DocsData.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    // heatmapData,
    top10Data,
    noHitData,
    top5DocsData, // 热门文档数据
    isLoading,
    fetchVisualizationData,
  }
})