import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore(
  'setting',
  () => {
    const settings = ref({
      model: '',
      apiKey: '',
      stream: true,
      maxTokens: 4096,
      temperature: 0.7,
      topP: 0.7,
      topK: 50,
    })

    return {
      settings,
    }
  },
  {
    persist: true,
  },
)
