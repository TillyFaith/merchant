<template>
  <div class="knowledge-detail">
    <el-card v-loading="isLoading">
      <template v-slot:header>
        <h1>{{ document.title }}</h1>
        <div class="detail-meta">
          <span style="margin-right: 20px;">业务类型: {{ getBusinessName(document.business) }}</span>
          <span style="margin-right: 20px;">场景: {{ getSceneName(document.scene) }}</span>
          <span>更新时间: {{ formatDate(document.updatedAt) }}</span>
        </div>
      </template>
      <div class="markdown-content" v-html="renderedContent"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useKnowledgeStore } from '@/stores/knowledge'
import { marked } from 'marked'
import 'github-markdown-css'
import { ElMessage } from 'element-plus'
import { initialCategories } from '@/constants/categories';

const route = useRoute()
const knowledgeStore = useKnowledgeStore()
const document = ref({})
const isLoading = ref(true)
const renderedContent = ref('')

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

onMounted(async () => {
  const docId = route.params.id
  console.log('路由参数:', route.params) // 确认是否执行到这里

  if (!docId) {
    console.error('未获取到文档ID')
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    // 修复：删除重复的变量声明
    console.log('view调用API加载文档详情:', docId)
    const docData = await knowledgeStore.loadDocument(docId)
    console.log('view文档详情页数据:', docData)

    // 添加数据有效性检查
    if (!docData) {
      console.error('文档数据为空')
      return
    }

    document.value = docData
    renderedContent.value = marked.parse(docData.content || '')
  } catch (error) {
    console.error('加载文档失败:', error)
    ElMessage.error('加载文档失败: ' + error.message)
  } finally {
    isLoading.value = false
  }
})

// 业务类型映射函数
defineProps(['id']);
const getBusinessName = (businessId) => {
  const category = initialCategories.find(cat => cat.id === businessId);
  return category ? category.name : '无';
};

// 场景类型映射函数
const getSceneName = (sceneKey) => {
  for (const cat of initialCategories) {
    if (cat.children) {
      const child = cat.children.find(c => c.key === sceneKey);
      if (child) return child.name;
    }
  }
  return ' 无';
};
</script>

<style scoped>
.knowledge-detail {
  padding: 20px;
}

.card-header {
  margin-bottom: 20px;
}

.meta-info {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.meta-info span {
  margin-right: 20px;
}

.markdown-content {
  font-size: 16px;
  line-height: 1.8;
}
</style>
