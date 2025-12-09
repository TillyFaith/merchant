<template>
  <el-container class="app-container">
    <el-header style="padding: 0;">
      <div class="knowledge-header"
        style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background-color: white; padding: 0 20px; height: 60px; align-items: center; display: flex;">
        <img src="@/assets/photo/logo_dark.svg" alt="Logo" style="height: 40px; margin-right: 20px;">
        <div class="header-title" style="font-size: 18px; font-weight: 500; margin-right: auto;"></div>
        <div class="action-buttons">
          <el-button class="action-btn" @click="navigateToKnowledgeManagement">
            <Document style="width: 18px; height: 18px; margin-right: 5px;" /> 知识文档管理
          </el-button>
          <el-button class="action-btn" @click="handleBack">
            <img style="width: 18px; height: 18px; margin-right: 5px;" src="@/assets/photo/返回.png" alt="back" /> 回到首页
          </el-button>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px" class="app-aside">
        <el-menu :default-openeds="['1']" background-color="#ffffff" text-color="#303133" active-text-color="#409eff"
          class="no-border-menu">
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <DataAnalysis />
              </el-icon>
              <span>数据可视化</span>
            </template>
            <el-menu-item index="1-1">高频问题Top10</el-menu-item>
            <el-menu-item index="1-2">零命中问题列表</el-menu-item>
            <el-menu-item index="1-3">知识文档热力图</el-menu-item>
          </el-sub-menu>
        </el-menu>
        <!-- 智能助理图标 -->
        <div class="chatbot" @click="handleChatbotClick">
          <img style="width: 30px; height: 30px;" src="@/assets/photo/robot.png" alt="robot" />
          <img style="margin-left: 10px; width: 64px; height: 20px;" src="@/assets/photo/robot_describe.JPG"
            alt="robot_describe" />
        </div>
      </el-aside>

      <el-main class="app-main" style="padding: 0 20px; background-color: #f5f7fa;">
        <!-- 零命中问题列表 - 单独一行 -->
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="24">
            <el-card shadow="always">
              <template #header>
                <div class="card-header">
                  <span>零命中问题列表</span>
                </div>
              </template>
              <ZeroHitQuestions :data="noHitData" />
            </el-card>
          </el-col>
        </el-row>
        <!-- Top5引用文档 - 单独一行 -->
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="24"> <!-- 修改为24格，占满整行 -->
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>知识文档热力图</span>
                </div>
              </template>
              <Top5Documents :data="top5DocsData" />
            </el-card>
          </el-col>
        </el-row>
        <!-- 高频问题Top10 - 单独一行 -->
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="24"> <!-- 修改为24格，占满整行 -->
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>高频问题Top10</span>
                </div>
              </template>
              <HighFrequencyQuestions :data="top10Data" />
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { DataAnalysis } from '@element-plus/icons-vue'
// import KnowledgeHeatmap from '@/components/KnowledgeHeatmap.vue'
import HighFrequencyQuestions from '@/components/HighFrequencyQuestions.vue'
import ZeroHitQuestions from '@/components/ZeroHitQuestions.vue'
import Top5Documents from '@/components/Top5Documents.vue'
import { useRouter } from 'vue-router'
import { Document } from '@element-plus/icons-vue'
// 新增：导入store和响应式相关依赖
import { useDataVisualizationStore } from '@/stores/dataVisualization'
import { onMounted, computed } from 'vue'
// import { ElMessage } from 'element-plus'

// 获取路由实例
const router = useRouter()
// 新增：获取数据可视化store实例
const visualizationStore = useDataVisualizationStore()
// 新增：定义加载状态
// const loading = ref(true)

const top10Data = computed(() => visualizationStore.top10Data)
const noHitData = computed(() => visualizationStore.noHitData)
const top5DocsData = computed(() => visualizationStore.top5DocsData)
// 导航到知识文档管理页面
const navigateToKnowledgeManagement = () => {
  router.push('/knowledge')
}
// 处理返回首页
const handleBack = () => {
  router.push('/')
}

// 新增：加载可视化数据
// const loadVisualizationData = async () => {
//   try {
//     loading.value = true
//     await visualizationStore.fetchVisualizationData()
//   } catch (error) {
//     ElMessage.error('数据加载失败：' + error.message)
//   } finally {
//     loading.value = false
//   }
// }
console.log('view 中top10Data', visualizationStore.top10Data)
// 新增：组件挂载时加载数据
onMounted(async () => {
  // await loadVisualizationData()
  await visualizationStore.fetchNoHitData()
  await visualizationStore.fetchTop5DocsData()
  await visualizationStore.fetchTop10Data()
})
</script>

<style scoped>
.knowledge-header {
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0);
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  margin-left: 10px;
}

.search-bar {
  margin-bottom: 20px;
}

.app-main {
  min-height: calc(100vh - 60px);
  padding: 20px;
}

/* 去除 el-menu 右边框线 */
::v-deep .no-border-menu {
  border-right: none !important;
}

/* 智能助理图标样式 */
.chatbot {
  position: fixed;
  bottom: 50px;
  left: 30px;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
}
</style>
