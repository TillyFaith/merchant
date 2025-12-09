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

  // 新增：获取Top10数据的独立方法
  const fetchTop10Data = async () => {
    try {
      const response = await getTop10Data()
      // 假设API返回格式为 { data: [...] }，如果不是请根据实际情况调整
      top10Data.value = Array.isArray(response.data) ? response.data.slice(0, 10) : []
      console.log('top10Data response:', top10Data.value)
    } catch (error) {
      console.error('Failed to fetch top10 data:', error)
      top10Data.value = []
      throw error // 可以选择抛出错误，让调用者处理
    }
  }

  // 新增：获取零命中数据的独立方法
  const fetchNoHitData = async () => {
    try {
      const response = await getNoHitData()
      // 假设API返回格式为 { data: [...] }，如果不是请根据实际情况调整
      noHitData.value = Array.isArray(response.data) ? response.data : []
      console.log('noHitData response:', noHitData.value)
    } catch (error) {
      console.error('Failed to fetch noHit data:', error)
      noHitData.value = []
      throw error // 可以选择抛出错误，让调用者处理
    }
  }

  // 新增：获取Top5文档数据的独立方法
  const fetchTop5DocsData = async () => {
    try {
      const response = await getTop5RefData()

      // 假设API返回格式为 { data: [...] }，如果不是请根据实际情况调整
      top5DocsData.value = Array.isArray(response.data) ? response.data : []
      console.log('top5DocsData response:', top5DocsData.value)
    } catch (error) {
      console.error('Failed to fetch top5Docs data:', error)
      top5DocsData.value = []
      throw error // 可以选择抛出错误，让调用者处理
    }
  }

  // 修改：重写fetchVisualizationData方法，按顺序调用三个独立方法
  // const fetchVisualizationData = async () => {
  //   isLoading.value = true
  //   try {
  //     // 按顺序调用三个方法，也可以根据需要并行调用
  //     await fetchNoHitData()
  //     await fetchTop5DocsData()
  //     // await fetchTop10Data()
  //   } catch (error) {
  //     console.error('Failed to fetch visualization data:', error)
  //   } finally {
  //     isLoading.value = false
  //   }
  // }

  return {
    // heatmapData,
    top10Data,
    noHitData,
    top5DocsData, // 热门文档数据
    isLoading,
    // fetchVisualizationData,
    fetchTop10Data,
    fetchNoHitData,
    fetchTop5DocsData,
  }
})
