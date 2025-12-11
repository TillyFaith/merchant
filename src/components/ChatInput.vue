<script setup>
import { ref, onUnmounted } from 'vue'
// 新增Message导入
import { ElMessage } from 'element-plus'
import { Microphone, Mute } from '@element-plus/icons-vue'
import { Close, Document } from '@element-plus/icons-vue'

// 输入框的值，使用 ref 实现响应式
const inputValue = ref('')
const fileList = ref([]) // 存储上传的文件列表
// 初始化语音识别实例和监听状态
// 标记是否正在监听语音
const isListening = ref(false)
// 标记语音识别实例是否真正可用（已完全停止）
const isRecognitionAvailable = ref(true)
// 存储语音识别实例
const recognition = ref(null)
// 存储超时计时器
const recognitionTimeout = ref(null)
// 定义组件的 props，接收 loading 状态
const props = defineProps({
  loading: {
    type: Boolean, // loading 的类型为布尔值
    default: false, // 默认值为 false
  },
})

// 定义组件的事件，这里声明了一个 send 事件
const emit = defineEmits(['send'])

// 处理发送消息的方法
const handleSend = () => {
  if (!inputValue.value.trim() || props.loading) return

  // 构建消息对象
  const messageContent = {
    text: inputValue.value.trim(),
    files: fileList.value,
  }

  // 触发 send 事件，将消息内容作为参数传递
  emit('send', messageContent)

  // 清空输入框和文件列表
  inputValue.value = ''
  fileList.value = []
}

// 处理换行的方法（Shift + Enter）
const handleNewline = (e) => {
  e.preventDefault() // 阻止默认的 Enter 发送行为
  inputValue.value += '\n' // 在当前位置添加换行符
}

// 处理文件上传
const handleFileUpload = (uploadFile) => {
  // 确保获取到的是文件对象
  const file = uploadFile.raw
  if (!file) return false

  fileList.value.push({
    name: file.name,
    url: URL.createObjectURL(file),
    type: file.type.startsWith('image/') ? 'image' : 'file',
    size: file.size,
    raw: file // 新增：保存原始文件对象用于上传
  })
  return false // 阻止自动上传
}

// 移除文件
const handleFileRemove = (file) => {
  const index = fileList.value.findIndex((item) => item.url === file.url)
  if (index !== -1) {
    URL.revokeObjectURL(fileList.value[index].url)
    fileList.value.splice(index, 1)
  }
}

// 强制停止语音识别
const forceStopRecognition = () => {
  console.log('强制停止语音识别');
  try {
    // 清除超时计时器
    if (recognitionTimeout.value) {
      clearTimeout(recognitionTimeout.value);
      recognitionTimeout.value = null;
    }

    // 停止识别
    if (recognition.value) {
      recognition.value.stop();
      // 某些浏览器可能需要调用 abort() 方法
      recognition.value.abort();
    }
  } catch (error) {
    console.error('强制停止语音识别失败:', error);
  } finally {
    // 直接重置状态，不依赖 onend 事件
    isListening.value = false;
    isRecognitionAvailable.value = true;
  }
};

// 初始化语音识别实例
const initSpeechRecognition = () => {
  // 检查浏览器是否支持语音识别
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    ElMessage.error('您的浏览器不支持语音识别功能');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false; // 只识别一次
  recognition.interimResults = true; // 返回中间结果，便于调试
  recognition.lang = 'zh-CN'; // 设置为中文
  recognition.maxAlternatives = 1; // 只返回一个结果

  // 添加事件监听
  recognition.onstart = () => {
    console.log('语音识别已开始');
    isListening.value = true;
    isRecognitionAvailable.value = false;

    // 设置超时，30秒后自动停止识别
    recognitionTimeout.value = setTimeout(() => {
      console.log('语音识别超时，自动停止');
      forceStopRecognition();
      ElMessage.info('语音识别已超时自动停止');
    }, 30000);
  };

  recognition.onend = () => {
    console.log('语音识别已结束');
    // 清除超时计时器
    if (recognitionTimeout.value) {
      clearTimeout(recognitionTimeout.value);
      recognitionTimeout.value = null;
    }
    isListening.value = false;
    isRecognitionAvailable.value = true;
  };

  recognition.onerror = (event) => {
    console.error('语音识别错误:', event.error);
    // 清除超时计时器
    if (recognitionTimeout.value) {
      clearTimeout(recognitionTimeout.value);
      recognitionTimeout.value = null;
    }

    // 根据错误类型显示不同的提示
    switch (event.error) {
      case 'not-allowed':
        ElMessage.error('麦克风权限被拒绝，请在浏览器设置中允许麦克风访问');
        break;
      case 'aborted':
        console.log('语音识别被中止');
        break;
      default:
        ElMessage.error('语音识别失败，请重试');
    }

    isListening.value = false;
    isRecognitionAvailable.value = true;
  };

  recognition.onresult = (event) => {
    console.log('语音识别结果事件:', event);

    // 处理识别结果
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    console.log('最终识别结果:', finalTranscript);
    console.log('中间识别结果:', interimTranscript);

    // 更新输入框内容
    if (finalTranscript) {
      inputValue.value += finalTranscript;
      console.log('输入框内容已更新:', inputValue.value);

      // 识别到最终结果后，自动停止识别
      forceStopRecognition();
    }
  };

  return recognition;
};

// 切换语音识别状态
const toggleSpeechRecognition = () => {
  console.log('切换语音识别状态，当前状态:', isListening.value, '是否可用:', isRecognitionAvailable.value);

  if (isListening.value) {
    // 如果正在监听，停止识别
    forceStopRecognition();
  } else {
    // 如果未在监听，且识别器可用，启动识别
    if (isRecognitionAvailable.value) {
      if (!recognition.value) {
        console.log('初始化语音识别实例');
        recognition.value = initSpeechRecognition();
        if (!recognition.value) return;
      }

      try {
        console.log('启动语音识别');
        recognition.value.start();
      } catch (error) {
        console.error('启动语音识别失败:', error);
        forceStopRecognition();
        ElMessage.error('语音识别启动失败，请重试');
      }
    } else {
      console.log('语音识别器不可用，正在等待停止');
      ElMessage.warning('语音识别正在关闭，请稍候再试');
    }
  }
};

// 组件卸载时清理资源
onUnmounted(() => {
  // 强制停止语音识别
  forceStopRecognition();

  // 释放文件 URL
  fileList.value.forEach(file => {
    URL.revokeObjectURL(file.url);
  });
});
</script>

<template>
  <div class="chat-input-wrapper">
    <!-- 文件预览区域 -->
    <div v-if="fileList.length > 0" class="preview-area">
      <div v-for="file in fileList" :key="file.url" class="preview-item">
        <!-- 图片预览 -->
        <div v-if="file.type === 'image'" class="image-preview">
          <img :src="file.url" :alt="file.name" />
          <div class="remove-btn" @click="handleFileRemove(file)">
            <el-icon>
              <Close />
            </el-icon>
          </div>
        </div>
        <!-- 文件预览 -->
        <div v-else class="file-preview">
          <el-icon>
            <Document />
          </el-icon>
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ (file.size / 1024).toFixed(1) }}KB</span>
          <div class="remove-btn" @click="handleFileRemove(file)">
            <el-icon>
              <Close />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
    <!-- 输入框 -->
    <el-input v-model="inputValue" type="textarea" :autosize="{ minRows: 1, maxRows: 6 }"
      placeholder="输入消息，Enter 发送，Shift + Enter 换行" resize="none" @keydown.enter.exact.prevent="handleSend"
      @keydown.enter.shift="handleNewline" />
    <div class="button-group">
      <!-- 语音识别按钮 -->
      <button class="action-btn voice-btn" :class="{ 'listening': isListening }"
        :disabled="props.loading || !isRecognitionAvailable">
        <el-icon v-if="!isListening" size="20px">
          <Microphone @click="toggleSpeechRecognition" />
        </el-icon>
        <el-icon v-else size="20px">
          <Mute @click="forceStopRecognition" />
        </el-icon>
      </button>
      <!-- 文件上传 -->
      <!-- <el-upload class="upload-btn" :auto-upload="false" :show-file-list="false" :on-change="handleFileUpload"
        accept=".pdf,.doc,.docx,.txt">
        <button class="action-btn"><img src="@/assets/photo/附件.png" alt="link" /></button>
      </el-upload> -->
      <!-- 图片上传 -->
      <el-upload class="upload-btn" :auto-upload="false" :show-file-list="false" :on-change="handleFileUpload"
        accept="image/*">
        <button class="action-btn" :disabled="props.loading">
          <img src="@/assets/photo/图片.png" alt="picture" />
        </button>
      </el-upload>
      <div class="divider"></div>
      <!-- 发送键 -->
      <button class="action-btn send-btn" :disabled="props.loading" @click="handleSend">
        <img src="@/assets/photo/发送.png" alt="send" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-input-wrapper {
  padding: 0.8rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* 预览区域容器样式 */
  .preview-area {
    margin-bottom: 8px;
    /* 与输入框的间距 */
    display: flex;
    /* 使用弹性布局 */
    flex-wrap: wrap;
    /* 允许多行显示 */
    gap: 8px;
    /* 预览项之间的间距 */

    /* 预览项容器样式 */
    .preview-item {
      position: relative;
      /* 为删除按钮定位做准备 */
      border-radius: 8px;
      /* 圆角边框 */
      overflow: hidden;
      /* 隐藏超出部分 */

      /* 图片预览样式 */
      .image-preview {
        width: 60px;
        /* 固定宽度 */
        height: 60px;
        /* 固定高度，保持正方形 */

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          /* 保持图片比例并填充容器 */
        }
      }

      /* 文件预览样式 */
      .file-preview {
        padding: 8px;
        /* 内边距 */
        background-color: #f4f4f5;
        /* 浅灰色背景 */
        border-radius: 8px;
        /* 圆角边框 */
        display: flex;
        /* 使用弹性布局 */
        align-items: center;
        /* 垂直居中对齐 */
        gap: 8px;
        /* 元素间距 */

        /* 文件名样式 */
        .file-name {
          max-width: 120px;
          /* 限制最大宽度 */
          overflow: hidden;
          /* 隐藏超出部分 */
          text-overflow: ellipsis;
          /* 超出显示省略号 */
          white-space: nowrap;
          /* 不换行 */
        }

        /* 文件大小样式 */
        .file-size {
          color: #909399;
          /* 浅灰色文字 */
          font-size: 12px;
          /* 小字体 */
        }
      }

      /* 删除按钮样式 */
      .remove-btn {
        position: absolute;
        /* 绝对定位 */
        top: 4px;
        /* 距顶部距离 */
        right: 4px;
        /* 距右侧距离 */
        width: 20px;
        /* 固定宽度 */
        height: 20px;
        /* 固定高度，保持正圆形 */
        background-color: rgba(0, 0, 0, 0.5);
        /* 半透明黑色背景 */
        border-radius: 50%;
        /* 圆形按钮 */
        display: flex;
        /* 使用弹性布局 */
        align-items: center;
        /* 垂直居中 */
        justify-content: center;
        /* 水平居中 */
        cursor: pointer;
        /* 鼠标指针样式 */
        color: white;
        /* 图标颜色 */

        /* 鼠标悬停效果 */
        &:hover {
          background-color: rgba(0, 0, 0, 0.7);
          /* 加深背景色 */
        }
      }
    }
  }

  /* 自定义输入框样式 */
  :deep(.el-textarea__inner) {
    border-radius: 8px;
    resize: none;
    border: none;
    box-shadow: none;

    &:focus {
      border: none;
      box-shadow: none;
    }
  }

  /* 按钮组容器样式 */
  .button-group {
    display: flex;
    /* 使用弹性布局 */
    justify-content: flex-end;
    /* 按钮靠右对齐 */
    margin-top: 0.25rem;
    /* 与输入框的上方间距 */
    gap: 0.5rem;
    /* 按钮之间的间距 */
    align-items: center;
    /* 垂直居中对齐，让分隔线居中 */

    .upload-btn {
      display: inline-block;
    }

    /* 分隔线样式 */
    .divider {
      height: 1rem;
      /* 分隔线高度16px */
      width: 1px;
      /* 分隔线宽度1px */
      background-color: var(--border-color);
      /* 使用主题变量设置颜色 */
      margin: 0;
      /* 重置所有边距 */
      margin-left: 0.125rem;
      /* 左边距2px */
      margin-right: 0.25rem;
      /* 右边距4px */
    }

    /* 通用按钮样式 */
    .action-btn {
      width: 1.75rem;
      /* 默认按钮宽度28px */
      height: 1.75rem;
      /* 默认按钮高度28px */
      border: none;
      /* 移除边框 */
      background: none;
      /* 移除背景色 */
      padding: 0;
      /* 移除内边距 */
      cursor: pointer;
      /* 鼠标悬停时显示手型 */
      border-radius: 50%;
      /* 圆形按钮 */
      display: flex;
      /* 使用弹性布局使图标居中 */
      align-items: center;
      /* 垂直居中 */
      justify-content: center;
      /* 水平居中 */
      transition: background-color 0.3s;
      /* 背景色过渡动画 */

      /* 按钮内图标样式 */
      img {
        width: 1rem;
        /* 默认图标宽度16px */
        height: 1rem;
        /* 默认图标高度16px */
      }

      /* 按钮悬停效果 */
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        /* 悬停时显示浅灰色背景 */
      }

      /* 发送按钮特殊样式 */
      &.send-btn {
        width: 2rem;
        /* 发送按钮宽度32px */
        height: 2rem;
        /* 发送按钮高度32px */
        background-color: #3f7af1;
        /* 蓝色背景 */

        img {
          width: 1.25rem;
          /* 发送按钮图标宽度20px */
          height: 1.25rem;
          /* 发送按钮图标高度20px */
        }

        &:hover {
          background-color: #3266d6;
          /* 悬停时加深背景色 */
        }
      }
    }
  }
}

.button-group {
  .voice-btn {
    &.listening {
      background-color: rgba(245, 108, 108, 0.1);
      color: #f56c6c;
    }

    img {
      width: 1rem;
      height: 1rem;
    }
  }
}
</style>
