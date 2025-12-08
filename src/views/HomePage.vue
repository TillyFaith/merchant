<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChatLineRound, Document, Histogram } from '@element-plus/icons-vue'
import SearchDialog from '@/components/SearchDialog.vue'
import router from '@/router'
// const searchText = ref('')
const showSearchDialog = ref(false)
// 导航到聊天视图
const navigateToChatview = () => {
  router.push('/chat')
}

// 导航到知识管理视图
const navigateToKnowledgeView = () => {
  router.push('/knowledge')
}

// 导航到可视化视图
const navigateToVisualization = () => {
  router.push('/visualization')
}

// 处理搜索框点击
// const handleSearchClick = () => {
//   showSearchDialog.value = true
// }

// 添加点击遮罩层关闭对话框的处理
const handleOverlayClick = (event) => {
  // 只有当点击的是遮罩层本身时才关闭对话框
  if (event.target.classList.contains('search-dialog-overlay')) {
    showSearchDialog.value = false
  }
}

// 处理点击外部关闭对话框
const handleClickOutside = (event) => {
  const searchDialog = document.querySelector('.search-dialog')
  if (
    searchDialog &&
    !searchDialog.contains(event.target) &&
    !event.target.closest('.search-container')
  ) {
    showSearchDialog.value = false
  }
}

// 处理快捷键
const handleKeydown = (event) => {
  // ESC 关闭对话框
  if (event.key === 'Escape') {
    showSearchDialog.value = false
  }
  // Cmd/Ctrl + K 打开对话框
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    showSearchDialog.value = true
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="home-page">
    <header class="header">
      <div class="header-left">
        <span class="logo-text">商家知识管理与问答系统</span>
      </div>
      <div class="header-right">
        <!-- <div class="search-container" @click="handleSearchClick">
          <div class="search-input">
            <el-icon class="search-icon">
              <Search />
            </el-icon>
            <input type="text" placeholder="搜索" readonly v-model="searchText" />
            <div class="shortcut-key">⌘ K</div>
          </div>
        </div> -->
        <a href="https://github.com" target="_blank" class="github-link">
          <img src="@/assets/photo/github.png" alt="GitHub" class="github-icon" />
        </a>
      </div>
    </header>
    <main class="main-content">
      <div class="hero-section">
        <h1 class="title">欢迎使用商家知识管理与问答系统</h1>
        <p class="description">支持对商家经营的知识库进行管理，同时提供一个聊天机器人，通过智能对话方便商家咨询问题。</p>

        <div class="features">
          <div class="feature-item" @click="navigateToChatview">
            <el-icon class="feature-icon">
              <ChatLineRound />
            </el-icon>
            <h3>问答机器人</h3>
            <p>以内嵌聊天组件的形式，为商家提供 7*24 小时的智能咨询服务。</p>
            <p class="note" style="color: #3f7af1">支持 xxx 模型</p>
          </div>
          <div class="feature-item" @click="navigateToKnowledgeView">
            <el-icon class="feature-icon">
              <Document />
            </el-icon>
            <h3>知识管理</h3>
            <p>按照业务、场景进行多级分类，查看、编辑、更新或删除知识文档，并可实时查看知识文档状态。</p>
            <p class="note">支持上传 pdf 文件、手动输入方式创建文档</p>
          </div>
          <div class="feature-item" @click="navigateToVisualization">
            <el-icon class="feature-icon">
              <Histogram />
            </el-icon>
            <h3>数据可视化</h3>
            <p>对知识库内容、会话量、会话常见问题等进行可视化的呈现与分析。</p>
            <p class="note">知识点热力图; 高频问题 Top10; 零命中问题列表</p>
          </div>
        </div>
        <div class="button-group">
          <router-link to="/chat" class="start-button">
            <span class="mirror-text">智能问答</span>
            <div class="liquid"></div>
          </router-link>
        </div>
      </div>
    </main>

    <!-- 搜索对话框 -->
    <Transition name="fade">
      <div v-if="showSearchDialog" class="search-dialog-overlay" @click="handleOverlayClick">
        <div class="search-dialog-container" @click.stop>
          <SearchDialog />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh; // 确保页面至少占满整个视口高度
  background-color: var(--el-bg-color); // 使用 Element Plus 的主题背景色
}

.header {
  height: 64px; // 固定头部高度
  padding: 0 32px; // 左右内边距
  display: flex; // 使用弹性布局
  align-items: center; // 垂直居中
  justify-content: space-between; // 两端对齐
  border-bottom: 1px solid var(--el-border-color); // 底部边框
  background-color: var(--el-bg-color); // 头部背景色

  .header-left {
    flex-shrink: 0; // 防止logo被压缩

    .logo-text {
      font-size: 20px;
      font-weight: 600;
      color: #171717;
      cursor: pointer;
      user-select: none;
      white-space: nowrap; // 防止文字换行
    }
  }

  .header-right {
    display: flex; // 使用弹性布局
    align-items: center; // 垂直居中对齐
    gap: 16px; // 子元素之间的间距
    flex: 1; // 占据剩余空间
    justify-content: flex-end; // 右对齐

    .search-container {
      flex: 1; // 搜索框容器占据剩余空间
      max-width: 280px; // 最大宽度限制
      min-width: 40px; // 减小最小宽度
      margin-left: 16px; // 与logo保持距离

      .search-input {
        display: flex; // 搜索框内部使用弹性布局
        align-items: center; // 搜索框内部元素垂直居中
        // max-width: 240px; // 搜索框最小宽度
        // min-width: 100px; // 搜索框最大宽度

        width: 100%; // 搜索框宽度填充容器
        height: 32px; // 搜索框固定高度
        padding: 0 12px; // 左右内边距
        border-radius: 6px; // 圆角边框
        background-color: #f2f2f2; // Vercel 风格的浅灰色背景

        .search-icon {
          flex-shrink: 0; // 防止图标被压缩
          font-size: 14px; // 搜索图标大小
          color: #8f8f8f; // Vercel 风格的图标颜色
          margin-right: 8px; // 图标右侧间距
        }

        input {
          flex: 1; // 输入框占据剩余空间
          width: 0; // 添加这行，强制输入框从0开始计算宽度
          min-width: 0; // 防止输入框溢出
          border: none; // 移除输入框边框
          outline: none; // 移除输入框轮廓
          background: none; // 移除输入框背景
          font-size: 13px; // 输入框字体大小
          color: #000; // Vercel 风格的文本颜色

          &::placeholder {
            color: #666666; // Vercel 风格的占位符颜色
          }
        }

        .shortcut-key {
          flex-shrink: 0; // 防止快捷键被压缩
          font-size: 12px; // 快捷键文本大小
          color: #171717; // Vercel 风格的快捷键文本颜色
          background-color: #fafafa; // 快捷键白色背景
          padding: 2px 4px; // 快捷键内边距
          border-radius: 4px; // 快捷键圆角
          border: 1.5px solid #dfdfdf; // Vercel 风格的边框
        }
      }
    }

    .github-link {
      display: flex; // 使用弹性布局
      align-items: center; // 垂直居中对齐
      height: 32px; // 与搜索框保持相同高度
      flex-shrink: 0; // 防止github图标被压缩
    }

    .github-icon {
      width: 22px; // 图标宽度
      height: 22px; // 图标高度
      cursor: pointer; // 鼠标指针样式
      opacity: 1; // 不透明度
    }
  }
}

.main-content {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;

  .hero-section {
    text-align: center;

    .title {
      font-size: 48px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 24px;
    }

    .description {
      font-size: 20px;
      color: #666;
      max-width: 600px;
      margin: 0 auto 64px;
      line-height: 1.5;
    }

    .features {
      text-decoration: none;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 40px;
      margin-bottom: 20px;

      .feature-item {
        padding: 32px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-4px);
        }

        .feature-icon {
          font-size: 32px;
          color: var(--el-color-primary);
          margin-bottom: 20px;
        }

        h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        p {
          font-size: 16px;
          color: #666;
          line-height: 1.5;
        }

        .note {
          font-size: 12px;
          color: #999;
          margin-top: 8px;
          font-style: italic;
        }
      }
    }

    .button-group {
      margin-top: 40px;
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    .start-button {
      position: relative;
      display: inline-block;
      padding: 20px 40px;
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      background: var(--el-color-primary);
      border-radius: 12px;
      text-decoration: none;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 6px 30px -10px var(--el-color-primary);

      // 方案3: 镜面文字
      .mirror-text {
        position: relative;
        z-index: 1;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 700;
        text-transform: uppercase;
        background: linear-gradient(180deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0.6) 100%);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
      }

      // 发光效果
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: 0.5s ease;
      }

      // 液体效果
      .liquid {
        position: absolute;
        top: -80px;
        left: 0;
        width: 200px;
        height: 200px;
        background: var(--el-color-primary-light-3);
        box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.3);
        transition: 0.5s;

        &::before,
        &::after {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          top: 0;
          left: 50%;
          transform: translate(-50%, -75%);
          background: #fff;
        }

        &::before {
          border-radius: 45%;
          animation: animate 5s linear infinite;
        }

        &::after {
          border-radius: 40%;
          animation: animate 10s linear infinite;
        }
      }

      span {
        position: relative;
        z-index: 1;
      }

      // 悬停效果
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 40px -10px var(--el-color-primary);

        &::before {
          left: 100%;
        }

        .liquid {
          top: -120px;
        }

        .mirror-text {
          background: linear-gradient(180deg,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.9) 50%,
              rgba(255, 255, 255, 0.7) 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }
      }

      // 点击效果
      &:active {
        transform: scale(0.98) translateY(0);
        box-shadow: 0 5px 20px -10px var(--el-color-primary);
      }
    }

    // 液体动画
    @keyframes animate {
      0% {
        transform: translate(-50%, -75%) rotate(0deg);
      }

      100% {
        transform: translate(-50%, -75%) rotate(360deg);
      }
    }
  }
}

.search-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  z-index: 1000;
}

.search-dialog-container {
  margin-top: 15vh;
  width: 640px;
}

.knowledge-button {
  --el-color-primary: var(--el-color-success);
  box-shadow: 0 6px 30px -10px var(--el-color-success);

  &:hover {
    box-shadow: 0 10px 40px -10px var(--el-color-success);
  }

  .liquid {
    background: var(--el-color-success-light-3);
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
