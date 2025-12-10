import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore(
  'llm-setting',
  () => {
    const settings = ref({
      model: 'deepseek-ai/DeepSeek-R1',
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


