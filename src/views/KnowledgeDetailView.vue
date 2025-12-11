<template>
  <div class="knowledge-detail">
    <el-card v-loading="isLoading">
      <template v-slot:header>
        <h1>{{ document.title }}</h1>
        <div class="detail-meta">
          <span style="margin-right: 20px;">业务类型: {{ getBusinessName(document.business) }}</span>
          <span style="margin-right: 20px;">场景: {{ getSceneName(document.scene) }}</span>
          <span>更新时间: {{ formatDate(document.updatedAt) }}</span>
          <!-- 添加PDF导出按钮 -->
          <el-tooltip content="下载" placement="top">
            <el-button :icon="Download" class="export-pdf-btn" style="" @click="exportToPdf" circle></el-button>
          </el-tooltip>
        </div>
      </template>
      <div class="markdown-content" ref="documentContent" v-html="renderedContent"></div>
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
import html2pdf from 'html2pdf.js'  // 导入PDF库
import { Download } from '@element-plus/icons-vue';

const route = useRoute()
const knowledgeStore = useKnowledgeStore()
const document = ref({})
const isLoading = ref(true)
const renderedContent = ref('')

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}
const documentContent = ref(null);
const exportToPdf = () => {
  // 获取要导出的文档内容元素
  const content = documentContent.value
  if (!content) return

  // 配置PDF选项
  const opt = {
    margin: 10,
    filename: `${document.value.title || '文档'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  // 执行导出
  html2pdf().from(content).set(opt).save()
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
    console.log('view调用API加载文档详情:', docId)
    const docData = await knowledgeStore.loadDocument(docId)
    console.log('view文档详情页数据:', docData)

    if (!docData) {
      console.error('文档数据为空')
      return
    }

    document.value = docData
    let processedContent = docData.content || ''

    // 1. 标题格式转换（修复顺序和匹配逻辑）
    // 先处理三级标题(X.X.X) - 最具体的模式
    processedContent = processedContent.replace(/^(\d+\.\d+\.\d+)(?![\d.])/gm, '### $1 ')
    // 再处理二级标题(X.X)
    processedContent = processedContent.replace(/^(\d+\.\d+)(?![\d.])/gm, '## $1 ')
    // 最后处理一级标题
    processedContent = processedContent.replace(/^(一|二|三|四|五|六|七|八|九|十|十一|十二|十三|十四|十五|十六|十七|十八|十九|二十)、/gm, '# $& ')
    processedContent = processedContent.replace(/^第([一二三四五六七八九十百千万]+)章/gm, '# 第$1章 ')


    // 2. 仅对标题名超过10个字的二级和三级标题应用换行
    processedContent = processedContent.replace(/(^#{2,3} [^ \n]+)(\s+)(.*)/gm, (match, titlePart, space, content) => {
      // 仅当标题名（content部分）超过10个字时才换行
      if (content.length > 10) {
        return `${titlePart}\n${content}`;
      }
      return match; // 不满足条件则保持原样
    })

    renderedContent.value = marked.parse(processedContent)
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

.export-pdf-btn {
  position: fixed;
  top: 70px;
  right: 65px;
  padding: 12px 12px;
  background: #409EFF;
  color: white;
  border: none;
  /* border-radius: 4px; */
  cursor: pointer;
}
</style>
