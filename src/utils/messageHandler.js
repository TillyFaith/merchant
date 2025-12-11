export const messageHandler = {
  // 格式化消息，生成标准化的聊天消息对象
  formatMessage(role, content, reasoning_content = '', files = [], references = [], title = '') {
    return {
      id: Date.now(),
      role,
      content, // 回复内容
      reasoning_content, //思考过程
      files,
      references, // 存储引用信息
      title, // 存储标题信息
      completion_tokens: 0,
      speed: 0,
      loading: false,
    }
  },

  // 处理流式响应
  async handleStreamResponse(response, updateCallback) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let accumulatedContent = ''
    let accumulatedReasoning = ''
    let accumulatedTitle = '' // 存储标题信息
    let accumulatedReferences = [] // 存储引用数据
    let startTime = Date.now()
    let completionTokens = 0
    let speed = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (!trimmedLine) continue

        // 跳过结束标记
        if (
          trimmedLine === 'data: [CHUNK DONE]' ||
          trimmedLine === 'data: [REF DONE]' ||
          trimmedLine === 'data: [TITLE DONE]'
        ) {
          continue
        }

        if (trimmedLine.startsWith('data: ')) {
          const jsonStr = trimmedLine.slice(5).trim()
          if (!jsonStr) continue

          try {
            const data = JSON.parse(jsonStr)
            let hasNewContent = false

            // 1. 处理标题
            if (data.type === 'title') {
              const chatTitle = data.choices[0].delta?.content || '日常会话'
              if (chatTitle) {
                accumulatedTitle += chatTitle
                hasNewContent = true
              }
            }
            // 2. 处理内容块类型
            else if (data.type === 'chunk' && data.choices && data.choices.length > 0) {
              const delta = data.choices[0].delta || {}
              const content = delta.content || ''
              const reasoning = delta.reasoning_content || ''

              if (content || reasoning) {
                accumulatedContent += content
                accumulatedReasoning += reasoning
                hasNewContent = true
              }
            }
            // 3. 处理引用文档
            else if (data.type === 'ref' && data.choices && data.choices.length > 0) {
              const delta = data.choices[0].delta || {}
              const refContent = delta.content || []
              for (const ref of refContent) {
                // 文档地址： http://localhost:5173/knowledge/${docId}
                // https://merchant-phi-ten.vercel.app/knowledge/${docId}
                const baseUrl =
                  typeof window !== 'undefined'
                    ? window.location.href.substring(0, window.location.href.indexOf('/chat'))
                    : 'http://localhost:5173/knowledge'
                const likedText = `[《${ref.title}》](${baseUrl}/knowledge/${ref.docId})`
                accumulatedReferences.push(likedText)
              }

              accumulatedReferences =
                '\n 以上回答参考知识库文档：\n' + accumulatedReferences.join('\n')

              // 将引用数据存入数组（去重处理，可选）
              if (Array.isArray(refContent) && refContent.length > 0) {
                console.log('accumulatedReferences:', accumulatedReferences)
                hasNewContent = true // 标记更新，用于传递引用数据
              }
            }

            // 4. 处理 tokens 统计
            if (data.usage) {
              completionTokens = data.usage.completion_tokens || 0
              const timeElapsed = (Date.now() - startTime) / 1000
              if (timeElapsed > 0) {
                speed = (completionTokens / timeElapsed).toFixed(2)
              }
              hasNewContent = true
            }

            // 5. 更新回调：传递内容、推理、tokens、速度、引用信息
            if (hasNewContent) {
              updateCallback(
                accumulatedContent,
                accumulatedReasoning,
                completionTokens,
                speed,
                accumulatedReferences, // 新增：传递引用数据
                accumulatedTitle, // 新增：传递标题信息
              )
            }

            // 保存 chatId
            if (data.id) {
              localStorage.setItem('chatId', data.id)
            }
          } catch (error) {
            console.warn('解析JSON失败:', error, '原始数据:', jsonStr)
          }
        }
      }
    }
  },

  // 处理非流式响应（同步修改：支持引用信息）
  handleNormalResponse(response, updateCallback) {
    try {
      const choices = response.choices || []
      const firstChoice = choices[0] || {}
      const message = firstChoice.message || {}

      const content = message.content || ''
      const reasoning = message.reasoning_content || ''
      const completionTokens = response.usage?.completion_tokens || 0
      const speed = response.speed || 0
      // 非流式响应的引用信息（如果有）
      const references = message.references || []

      updateCallback(content, reasoning, completionTokens, speed, references)
    } catch (error) {
      console.error('处理非流式响应失败:', error)
      throw error
    }
  },

  // 统一响应处理函数
  async handleResponse(response, isStream, updateCallback) {
    try {
      if (isStream) {
        await this.handleStreamResponse(response, updateCallback)
      } else {
        this.handleNormalResponse(response, updateCallback)
      }
    } catch (error) {
      console.error('处理响应失败:', error)
      throw error
    }
  },
}
