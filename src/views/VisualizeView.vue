<script setup>
import { DataAnalysis } from '@element-plus/icons-vue'
import KnowledgeHeatmap from '@/components/KnowledgeHeatmap.vue'
import HighFrequencyQuestions from '@/components/HighFrequencyQuestions.vue'
import ZeroHitQuestions from '@/components/ZeroHitQuestions.vue'
import Top5Documents from '@/components/Top5Documents.vue'
import { useRouter } from 'vue-router'
import { Document } from '@element-plus/icons-vue'

// 获取路由实例
const router = useRouter()
// 导航到知识文档管理页面
const navigateToKnowledgeManagement = () => {
  router.push('/knowledge')
}
// 处理返回首页
const handleBack = () => {
  router.push('/')
}
</script>
<template>
  <el-container class="app-container">
    <el-header style="margin-top: 10px;">
      <div class="knowledge-header" style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background-color: white; padding: 0 20px;
      height: 60px; align-items: center;">
        <img src="@/assets/photo/logo_dark.svg" alt="Logo" style="height: 40px; margin-right: 100px;">
        <div class="action-buttons">
          <el-button class="action-btn" style="position: absolute; right: 200px;"
            @click="navigateToKnowledgeManagement">
            <Document style="width: 20px; height: 20px; margin-right: 10px;" /> 知识文档管理
          </el-button>
          <el-button style="position: absolute; right: 50px;" class="action-btn" @click="handleBack">
            <img style="width: 22px; height: 22px; margin-right: 10px;" src="@/assets/photo/返回.png" alt="back" />
            回到首页
          </el-button>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px" class="app-aside">
        <el-menu :default-openeds="['1']">
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <DataAnalysis />
              </el-icon>
              <span>数据可视化</span>
            </template>
            <el-menu-item index="1-1">知识点热力图</el-menu-item>
            <el-menu-item index="1-2">高频问题Top10</el-menu-item>
            <el-menu-item index="1-3">零命中问题列表</el-menu-item>
            <el-menu-item index="1-4">Top5引用文档</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main class="app-main">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>知识点热力图</span>
                </div>
              </template>
              <KnowledgeHeatmap />
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>高频问题Top10</span>
                </div>
              </template>
              <HighFrequencyQuestions />
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>Top5引用文档</span>
                </div>
              </template>
              <Top5Documents />
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="24">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>零命中问题列表</span>
                </div>
              </template>
              <ZeroHitQuestions />
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>



<style scoped>
.knowledge-header {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;

  .action-button {
    width: 1px;
    height: 1px;
  }
}

.app-container {
  height: 100vh;
}

.app-header {
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 20px;
}

.app-aside {
  background-color: #f5f7fa;
  border-right: 1px solid #e4e7ed;
}

.app-main {
  padding: 20px;
  background-color: #f0f2f5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
