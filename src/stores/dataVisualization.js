// Import ref from Vue instead of Pinia
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getVisualizationData } from '@/utils/api'

export const useDataVisualizationStore = defineStore('dataVisualization', () => {
  const heatmapData = ref([])
  const top10Data = ref([])
  const trendData = ref([])
  const noHitData = ref([])
  const isLoading = ref(false)

  const fetchVisualizationData = async () => {
    isLoading.value = true
    try {
      const response = await getVisualizationData()
      heatmapData.value = response.heatmapData
      top10Data.value = response.top10Data
      trendData.value = response.trendData
      noHitData.value = response.noHitData
    } catch (error) {
      console.error('Failed to fetch visualization data:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    heatmapData, top10Data, trendData, noHitData, isLoading, fetchVisualizationData
  }
})
