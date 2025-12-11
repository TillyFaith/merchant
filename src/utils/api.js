import { useSettingStore } from '@/stores/setting'

// const API_BASE_URL = 'https://api.siliconflow.cn/v1'
// 修改为相对路径，通过代理访问
// const BASE_URL = '/api'
const BASE_URL = 'http://8.136.47.218:80'

// 获取当前业务和场景的文档列表
export const getDocList = async (business, scene) => {
  const response = await fetch(
    `${BASE_URL}/knowledge/getAllDoc?business=${business}&scene=${scene}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.message || '获取文档失败')
  }
  return data.data
}
// 获取文档内容
export const getDocumentApi = async (docId) => {
  const response = await fetch(`${BASE_URL}/knowledge/getDoc?docId=${encodeURIComponent(docId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('文档详情接口返回数据:', data) // 添加调试日志
  if (!data.ok) {
    throw new Error(data.message || '获取文档失败')
  }
  return data.data
}

// 创建文档
export const createDocument = async (formData) => {
  const response = await fetch(`${BASE_URL}/knowledge/addDoc`, {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.message || '创建文档失败')
  }
  return data
}

// 删除文档
export const deleteDocumentApi = async (docId) => {
  const response = await fetch(`${BASE_URL}/knowledge/delDoc`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ docId }),
  })

  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.message || '删除文档失败')
  }
  return data
}

// 修改文档
export const modifyDocumentApi = async (formData) => {
  const response = await fetch(`${BASE_URL}/knowledge/modifyDoc`, {
    method: 'PUT',
    body: formData,
  })

  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.message || '修改文档失败')
  }
  return data
}
// 更新文档状态
export const updateDocumentStatusApi = async (docId, status) => {
  const response = await fetch(`${BASE_URL}/knowledge/updateStatus`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      docId: docId,
      status: status, // 直接传递状态值（0/1），需与后端保持一致
    }),
  })

  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.message || '更新文档状态失败')
  }
  return data
}

// 创建新的聊天，发送聊天内容
export const createChatCompletion = async (chatId, query, file = []) => {
  const settingStore = useSettingStore()
  const formData = new FormData()
  formData.append('chatId', chatId)
  formData.append('query', query)
  // 添加文件到FormData
  if (file.raw) {
    formData.append(`file`, file.raw)
  }
  const options = {
    method: 'POST',
    // 移除Content-Type，让浏览器自动设置multipart/form-data格式及边界
    headers: {
      // 'Content-Type': 'application/json', // 注释掉JSON格式头
      // 如需认证可添加token: `Bearer ${settingStore.settings.apiKey}`
    },
    body: formData,
  }

  try {
    const startTime = Date.now()
    const response = await fetch(`${BASE_URL}/robot/chat`, options)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (settingStore.settings.stream) {
      console.log('当前回答内容', response)
      return response // 直接返回响应对象以支持流式读取
    } else {
      const data = await response.json()
      const duration = (Date.now() - startTime) / 1000 // 使用本地计时
      data.speed = (data.usage.completion_tokens / duration).toFixed(2)
      return data
    }
  } catch (error) {
    console.error('Chat API Error:', error)
    throw error
  }
}

// 获取可视化数据
export const getVisualizationData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/robot/visualization`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Visualization API Error:', error)
    throw error
  }
}

/**
 * 获取高频问题Top10数据
 */
export const getTop10Data = async () => {
  const response = await fetch(`${BASE_URL}/robot/topQuestions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.message || '获取高频问题Top10数据失败')
  }
  return data
}

/**
 * 获取 top5引用文档数据
 */
export const getTop5RefData = async () => {
  const response = await fetch(`${BASE_URL}/robot/topDocs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.message || '获取知识文档热力图数据失败')
  }
  return data
}

/**
 * 获取未名中问题数据
 */
export const getNoHitData = async () => {
  const response = await fetch(`${BASE_URL}/robot/zeroHit`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.message || '获取未命中问题数据失败')
  }
  return data
}
