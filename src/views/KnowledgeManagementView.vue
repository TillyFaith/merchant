<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useKnowledgeStore } from '@/stores/knowledge'
import { useRouter } from 'vue-router'
import { UploadFilled, Edit, Delete, Search, Histogram } from '@element-plus/icons-vue';
import sideMenu from '@/components/SideMenu.vue'
import { initialCategories } from '@/constants/categories'
// 知识存储
const knowledgeStore = useKnowledgeStore()
const categories = initialCategories || []
const getScenesByBusiness = (businessId) => {
  const category = categories.find(cat => cat.id === businessId)
  return category?.children || []
}
// 路由实例
const router = useRouter()

// 处理返回首页
const handleBack = () => {
  router.push('/')
}

// 搜索标题查询文档
const searchQuery = ref('')
// 当前选中分类
const savedScene = ref(localStorage.getItem('savedScene') || 'all')
// 视图模式 (list/card)
const viewMode = ref('list')
// 文档上传对话框
const uploadDialogVisible = ref(false)

// 新建文档标题
const newDocumentTitle = ref('')
// 新建文档内容
const newDocumentContent = ref('')
// 新建文档业务类型
const newDocumentBusiness = ref('')
// 新建文档场景类型
const newDocumentScene = ref('')

// 获取过滤后的知识文档
const filteredDocuments = computed(() => {
  const documents = knowledgeStore.documents || [];
  // 如需保留搜索功能则取消注释以下代码
  return documents.filter(doc => {
    const docTitle = doc.title || '';
    return docTitle.toLowerCase().includes((searchQuery.value || '').toLowerCase());
  });
});

// 初始化
onMounted(() => {
  categories.value = knowledgeStore.categories?.value || []
  const savedBusiness = localStorage.getItem('savedBusiness') || ''
  const savedScene = localStorage.getItem('savedScene') || ''
  knowledgeStore.loadDocList(savedBusiness, savedScene)
})

// 处理文档上传
const handleUpload = (file) => {
  if (!newDocumentBusiness.value || !newDocumentScene.value || !newDocumentTitle.value) {
    ElMessage.warning('请填写标题并选择业务和场景类型')
    return
  }

  knowledgeStore.uploadDocument(file, newDocumentTitle.value, newDocumentBusiness.value, newDocumentScene.value)
    .then(() => {
      // 清空表单
      ElMessage.success('文档上传成功')
    })
    .catch(error => {
      console.error('上传失败:', error)
      ElMessage.error('上传失败: ' + error.message)
    })
}
// 创建文本文档
const createTextDocument = async () => {
  if (!newDocumentTitle.value || !newDocumentContent.value || !newDocumentBusiness.value) {
    ElMessage.warning('请填写标题、内容、业务类型和场景类型')
    return
  }
  try {
    await knowledgeStore.createTextKnowledge({
      title: newDocumentTitle.value,
      content: newDocumentContent.value,
      business: newDocumentBusiness.value,
      scene: newDocumentScene.value
    })
    newDocumentTitle.value = ''
    newDocumentContent.value = ''
    newDocumentBusiness.value = ''
    newDocumentScene.value = ''
    ElMessage.success('文档创建成功')
  } catch (error) {
    console.error('创建文档失败:', error)
    ElMessage.error('创建文档失败: ' + error.message)
  }
}

// 导航到文档详情
const navigateToDocument = (docId) => {
  router.push(`/knowledge/${docId}`)
}

// 删除文档
const handleDelete = (docId) => {
  ElMessageBox.confirm('确定要删除此文档吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await knowledgeStore.deleteDocument(docId)
    } catch (error) {
      console.error('删除失败:', error)
    }
  }).finally(() => {
    knowledgeStore.loadDocList(localStorage.getItem('savedBusiness') || '', localStorage.getItem('savedScene') || '')
  })
}

// 分类选择处理函数
const handleCategorySelect = (businessId, sceneId) => {
  knowledgeStore.documents.value = []
  knowledgeStore.loadDocList(businessId, sceneId);
  savedScene.value = sceneId;
  localStorage.setItem('savedScene', sceneId);
  localStorage.setItem('savedBusiness', businessId);
}
const handleChatbotClick = () => {
  // 点击聊天机器人图标时触发的事件
  router.push('/chat')
}
// 处理状态切换
const handleStatusChange = async (docId, newStatus) => {
  try {
    await knowledgeStore.updateDocumentStatus(docId, newStatus);
    ElMessage.success(`文档状态${newStatus === 1 ? '生效' : '失效'}`);
  } catch (error) {
    console.error('更新状态失败:', error);
    ElMessage.error('更新状态失败，请重试');
  }
}
// 新增编辑模式相关变量
const isEditMode = ref(false)
const currentEditDocId = ref(null)
const dialogTitle = ref('上传文档')

// 修改编辑按钮处理函数
const handleEdit = async (docId) => {
  isEditMode.value = true;
  currentEditDocId.value = docId;
  dialogTitle.value = '编辑文档';

  // 获取文档详情并填充表单
  const doc = await knowledgeStore.loadDocument(docId);
  newDocumentBusiness.value = doc.business;
  newDocumentScene.value = doc.scene;
  newDocumentTitle.value = doc.title;
  newDocumentContent.value = doc.content;
  uploadDialogVisible.value = true;
};

// 修改提交处理函数
const updateTextDocument = async () => {
  if (!newDocumentTitle.value.trim()) {
    ElMessage.error('文档标题不能为空');
    return;
  }

  const formData = new FormData();
  formData.append('content', newDocumentContent.value);
  formData.append('docId', currentEditDocId.value);

  try {
    await knowledgeStore.modifyDocument(newDocumentTitle.value, formData);
    ElMessage.success('文档修改成功');
    uploadDialogVisible.value = false;
    // 修复未定义变量错误
    knowledgeStore.loadDocList(newDocumentBusiness.value, newDocumentScene.value);
  } catch (error) {
    ElMessage.error('文档修改失败: ' + error.message);
  }
};

</script>

<template>
  <el-header style="margin-top: 10px;">
    <div class="knowledge-header" style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background-color: white; padding: 0 20px;
      height: 60px; align-items: center;">
      <img src="@/assets/photo/logo_dark.svg" alt="Logo" style="height: 40px; margin-right: 100px;">
      <div class="action-buttons">
        <el-button @click="uploadDialogVisible = true" :icon="UploadFilled">
          创建文档
        </el-button>
        <el-input v-model="searchQuery" :prefix-icon="Search" placeholder="搜索文档标题..." class="search-input" />
        <!-- 新增数据可视化跳转按钮 -->
        <el-button style="position: absolute; right: 180px;" class="action-btn" :icon="Histogram"
          @click="router.push('/visualization')">
          数据可视化
        </el-button>
        <el-button style="position: absolute; right: 50px;" class="action-btn" @click="handleBack">
          <img style="width: 22px; height: 22px;" src="@/assets/photo/返回.png" alt="back" />
          回到首页
        </el-button>
        <!-- 上传文档对话框 -->
        <el-dialog v-model="uploadDialogVisible" :title="dialogTitle" @close="() => {
          if (isEditMode) {
            isEditMode = false
            currentEditDocId = null
          }
          // 清空表单
          newDocumentTitle = ''
          newDocumentContent = ''
        }">
          <el-form class="upload-form">
            <el-form-item label="业务" required>
              <!-- 将 v-model 从 documentBusiness 改为 newDocumentBusiness -->
              <el-select v-model="newDocumentBusiness" placeholder="请选择业务">
                <el-option v-for="category in categories" :key="category.id" :label="category.name"
                  :value="category.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="getScenesByBusiness(newDocumentBusiness).length > 0" label="场景" required>
              <!-- 将 v-model 从 documentScene 改为 newDocumentScene -->
              <el-select v-model="newDocumentScene" placeholder="请选择场景">
                <el-option v-for="scene in getScenesByBusiness(newDocumentBusiness)" :key="scene.id" :label="scene.name"
                  :value="scene.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标题" required>
              <el-input v-model="newDocumentTitle" placeholder="输入文档标题"></el-input>
            </el-form-item>
            <el-upload class="upload-demo" action="" :auto-upload="false" :on-change="handleUpload"
              :show-file-list="true" accept=".pdf,.doc,.docx,.txt">
              <el-button type="primary">上传文件</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  支持 PDF格式，最大 10MB
                </div>
              </template>
            </el-upload>
          </el-form>
          <div class="manual-input-section">
            <el-form>
              <el-form-item label="内容" required>
                <el-input type="textarea" v-model="newDocumentContent" :rows="5" placeholder="输入文档内容"></el-input>
              </el-form-item>
              <!-- 修改按钮文本和点击事件 -->
              <el-button v-if="!isEditMode" type="primary" @click="createTextDocument">
                创建文档
              </el-button>
              <el-button v-else type="primary" @click="updateTextDocument">
                修改文档
              </el-button>
            </el-form>
          </div>
        </el-dialog>
      </div>
    </div>
  </el-header>
  <el-container style="height: 100vh;">
    <el-aside width="200px" style="overflow: hidden; border-right: 1px solid var(--el-menu-border-color);">
      <sideMenu @categorySelected="handleCategorySelect" />
    </el-aside>
    <el-main>
      <div class="documents-container">
        <div v-if="viewMode === 'list'" class="documents-list">
          <el-table :data="filteredDocuments" stripe>
            <el-table-column prop="id" label="文档 ID" width="350"></el-table-column>
            <el-table-column prop="title" label="文档标题" width="200"></el-table-column>
            <el-table-column prop="updatedAt" label="更新日期" width="200">
              <template #default="scope">
                {{ new Date(scope.row.updatedAt).toLocaleString() }}
              </template>
            </el-table-column>
            <!-- 新增状态栏列 -->
            <el-table-column label="状态" width="180">
              <template #default="scope">
                <div style="display: flex; align-items: center;">
                  <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                    @change="handleStatusChange(scope.row.id, $event)" />
                  <span style="margin-left: 8px;">
                    {{ scope.row.status === 1 ? '生效中' : '未生效' }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="400">
              <template #default="scope">
                <el-button size="small" @click="navigateToDocument(scope.row.id)">查看</el-button>
                <el-button size="small" type="primary" :icon="Edit" @click="handleEdit(scope.row.id)">编辑</el-button>
                <el-button size="small" type="danger" :icon="Delete" @click="handleDelete(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-main>
    <!-- 修改chatbot-icon容器样式，使用flex布局 -->
    <div class="chatbot" @click="handleChatbotClick">
      <img style="width: 30px; height: 30px;" src="@/assets/photo/robot.png" alt="robot" />
      <!-- 移除p标签的text-align样式，添加垂直居中 -->
      <img style="margin-left: 10px; width: 64px; height: 20px;" src="@/assets/photo/robot_describe.JPG"
        alt="robot_describe" />
    </div>
  </el-container>
</template>

<style scoped>
.knowledge-management-container {
  padding: 20px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.el-aside {
  transition: width 0.3s ease;
}

.el-menu-item {
  padding-left: 20px !important;
}

.el-menu--collapse .el-menu-item .el-icon,
.el-menu--collapse .el-submenu .el-icon {
  margin-right: 0;
}

.el-menu--collapse .el-menu-item span,
.el-menu--collapse .el-submenu__title span {
  display: none;
}

.collapse-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
}

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

.knowledge-filter {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  max-width: 500px;
}

.category-select {
  width: 200px;
}

.documents-container {
  margin-top: 20px;
}

.documents-list {
  width: 100%;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.document-card {
  height: 100%;
  cursor: pointer;
  transition: transform 0.2s;
}

.document-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.status-tag {
  margin-left: auto;
}

.doc-title {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc-busine {
  color: #666;
  margin-bottom: 5px;
}

.doc-date {
  color: #999;
  font-size: 12px;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.empty-state {
  text-align: center;
  padding: 50px 0;
  color: #666;
}

.manual-input-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #eee;
}

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
