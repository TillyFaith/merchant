export const messageHandler = {
  // 格式化消息，生成标准化的聊天消息对象，用于初始化或更新消息。
  formatMessage(role, content, reasoning_content = '', files = []) {
    return {
      id: Date.now(),
      role,
      content,
      reasoning_content,
      files,
      completion_tokens: 0,
      speed: 0,
      loading: false,
    }
  },

  // 处理流式响应
  // 处理流式响应（修复版）
  async handleStreamResponse(response, updateCallback) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let accumulatedContent = ''
    let accumulatedReasoning = ''
    let startTime = Date.now()
    let completionTokens = 0 // 单独维护 completion_tokens，避免依赖 data.usage
    let speed = 0 // 单独维护速度，避免依赖 data.usage

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter((line) => line.trim() !== '')

      for (const line of lines) {
        if (line === 'data: [DONE]') continue
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(5))
          let hasNewContent = false // 标记是否有新内容需要更新 UI

          // 1. 处理 choices 数据（只在 choices 非空时访问）
          if (data.choices && data.choices.length > 0) {
            const delta = data.choices[0].delta || {}
            const content = delta.content || ''
            const reasoning = delta.reasoning_content || ''

            // 如果有新内容，累加并标记更新
            if (content || reasoning) {
              accumulatedContent += content
              accumulatedReasoning += reasoning
              hasNewContent = true
            }
          }

          // 2. 处理 usage 数据（只在 usage 存在时更新 tokens 和速度）
          if (data.usage) {
            completionTokens = data.usage.completion_tokens || 0
            // 速度计算：只在有 completion_tokens 且时间差 > 0 时计算
            const timeElapsed = (Date.now() - startTime) / 1000
            if (timeElapsed > 0) {
              speed = (completionTokens / timeElapsed).toFixed(2)
            }
            hasNewContent = true // usage 更新也需要触发 UI 更新
          }

          // 3. 只在有新内容时调用 updateCallback，避免无效更新
          if (hasNewContent) {
            updateCallback(accumulatedContent, accumulatedReasoning, completionTokens, speed)
          }

          // 4. 保存 chatId（如果存在）
          if (data.id) {
            localStorage.setItem('chatId', data.id)
          }
        }
      }
    }
  },

  // 处理非流式响应
  handleNormalResponse(response, updateCallback) {
    updateCallback(
      response.choices[0].message.content,
      response.choices[0].message.reasoning_content || '',
      response.usage.completion_tokens,
      response.speed,
    )
  },

  // 统一的响应处理函数
  async handleResponse(response, isStream, updateCallback) {
    if (isStream) {
      await this.handleStreamResponse(response, updateCallback)
    } else {
      this.handleNormalResponse(response, updateCallback)
    }
  },
}
