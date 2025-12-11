import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getDocList,
  getDocumentApi,
  createDocument,
  deleteDocumentApi,
  modifyDocumentApi,
  updateDocumentStatusApi,
} from '@/utils/api'
import { defineStore } from 'pinia'
import { initialCategories } from '@/constants/categories'

export const useKnowledgeStore = defineStore(
  'knowledge',
  () => {
    // 知识文档列表
    const documents = ref([])
    // 分类列表
    const categories = ref(initialCategories)
    // 加载状态
    const isLoading = ref(false)
    //  加载文档列表
    const loadDocList = async (business, scene) => {
      isLoading.value = true
      try {
        // 调用从api.js导入的getDocList函数
        const docList = await getDocList(business, scene)
        console.log('docList:', docList)
        // 2. 处理文档数据格式并更新store
        if (docList.length !== 0) {
          documents.value = docList.map((doc) => ({
            id: doc.docId?.toString() || '',
            title: doc.title || doc.doc,
            content: doc.content || '',
            business: doc.business || business,
            scene: doc.scene || scene,
            status: doc.status,
            updatedAt: doc.updatedAt ? new Date(doc.updatedAt.replace(' ', 'T')).getTime() : null,
          }))
        } else {
          documents.value = []
        }
        console.log('documents', documents.value)
        ElMessage.success('文档列表加载成功')
      } catch (error) {
        console.error('加载文档列表失败:', error)
        ElMessage.error(`加载失败: ${error.message || '未知错误'}`)
        // 3. 错误时使用本地缓存数据
        // const cachedDocs = localStorage.getItem('knowledge_docs')
        // if (cachedDocs) documents.value = JSON.parse(cachedDocs)
      } finally {
        isLoading.value = false
      }
    }
    // 查看文档
    const loadDocument = async (docId) => {
      isLoading.value = true
      try {
        const response = await getDocumentApi(docId)
        console.log('当前文档：', response[0])
        // 获取响应数据中的第一个文档对象
        const targetDoc = response[0]

        // 映射API返回的字段到组件所需格式
        const processedDoc = {
          id: targetDoc.docId?.toString() || '',
          title: targetDoc.title || '无标题文档',
          content: targetDoc.content || '',
          business: targetDoc.business || '未分类',
          scene: targetDoc.scene || '未指定',
          updatedAt: targetDoc.updated_at // 将uploadAt改为updatedAt
            ? new Date(targetDoc.updated_at.replace(' ', 'T')).getTime()
            : targetDoc.created_at
              ? new Date(targetDoc.created_at.replace(' ', 'T')).getTime()
              : null,
        }
        console.log('processedDoc:', processedDoc)

        // 修复：只更新当前文档数据，不覆盖整个列表
        const index = documents.value.findIndex((doc) => doc.id === processedDoc.id)
        if (index !== -1) {
          documents.value[index] = processedDoc
        } else {
          // 如果是新文档，添加到列表
          documents.value.push(processedDoc)
        }
        return processedDoc
      } catch (error) {
        console.error('加载文档失败:', error)
        ElMessage.error('加载文档失败: ' + error.message)
        throw error
      } finally {
        isLoading.value = false
      }
    }
    // 删除文档
    const deleteDocument = async (docId) => {
      isLoading.value = true
      try {
        const res = await deleteDocumentApi(docId)
        if (res.ok) {
          documents.value = documents.value.filter((doc) => doc.docId !== docId)
          ElMessage.success('文档删除成功')
        }
      } catch (error) {
        console.error('删除文档失败:', error)
        ElMessage.error('删除文档失败: ' + error.message)
        throw error
      } finally {
        isLoading.value = false
      }
    }
    // 修改文档
    const modifyDocument = async (title, formData) => {
      isLoading.value = true
      try {
        await modifyDocumentApi(formData)
        const index = documents.value.findIndex((doc) => doc.title === title)
        if (index !== -1) {
          documents.value[index] = {
            ...documents.value[index],
            title: formData.get('title') || title,
            status: formData.get('status') === '0' ? 'active' : 'inactive',
          }
        }
        ElMessage.success('文档修改成功')
      } catch (error) {
        console.error('修改文档失败:', error)
        ElMessage.error('修改文档失败: ' + error.message)
        throw error
      } finally {
        isLoading.value = false
      }
    }
    // 上传pdf文件
    const uploadDocument = async (file, title, business, scene) => {
      isLoading.value = true
      try {
        const formData = new FormData()
        formData.append('file', file) // 文件对象 (test2.pdf)
        formData.append('title', title) // 标题 (pdf_test4)
        formData.append('business', business) // 业务类型 (business2_test)
        formData.append('scene', scene) // 场景类型 (scene2_test)
        formData.append('status', 0) // 状态值 (固定为0)

        await createDocument(formData)

        // 修复：使用 business 作为分类ID查询（或根据实际业务逻辑调整）
        const category = categories.value.find((c) => c.id === business)
        const newDocument = {
          id: '',
          title: title, // 使用传递的标题参数
          content: '',
          categoryId: business, // 修正分类ID
          categoryName: category ? category.name : '未分类',
          fileUrl: '',
          fileType: file.type,
          status: 0, // 正确存储状态值
          uploadDate: new Date().toISOString(),
          vectorized: false,
          createdAt: Date.now(),
        }

        documents.value.push(newDocument)
        ElMessage.success('文档上传成功')
        return newDocument
      } catch (error) {
        console.error('上传文档失败:', error)
        ElMessage.error(`上传文档失败: ${error.message}`)
        throw error
      } finally {
        isLoading.value = false
      }
    }

    // 创建文本知识
    const createTextKnowledge = async (knowledgeData) => {
      isLoading.value = true
      try {
        const formData = new FormData()
        formData.append('title', knowledgeData.title)
        formData.append('business', knowledgeData.business || undefined)
        formData.append('scene', knowledgeData.scene || undefined)
        formData.append('status', 0)
        formData.append('content', knowledgeData.content)

        const res = await createDocument(formData)
        console.log('newdocId:', res.data.docId)
        const category = categories.value.find((c) => c.id === knowledgeData.categoryId)
        const newDocument = {
          id: res.data.docId,
          title: knowledgeData.title,
          content: knowledgeData.content,
          categoryId: knowledgeData.categoryId,
          categoryName: category ? category.name : '未分类',
          fileType: 'text',
          status: '0',
          updatedAt: Date.now(), // 新代码 - 统一字段名
        }

        documents.value.push(newDocument)
        ElMessage.success('文本知识创建成功')
        return newDocument
      } catch (error) {
        console.error('创建文本知识失败:', error)
        ElMessage.error('创建文本知识失败: ' + error.message)
        throw error
      } finally {
        isLoading.value = false
      }
    }

    // 文档状态更新
    const updateDocumentStatus = async (docId, status) => {
      isLoading.value = true
      try {
        // 调用API更新状态
        await updateDocumentStatusApi(docId, status)
        // 同步更新本地状态
        const index = documents.value.findIndex((doc) => doc.id === docId)
        if (index !== -1) {
          documents.value[index].status = status === 1 ? 'active' : 'inactive'
          // 更新原始状态值（与接口返回保持一致）
          documents.value[index].rawStatus = status
        }
        return true
      } catch (error) {
        console.error('更新文档状态失败:', error)
        throw error
      } finally {
        isLoading.value = false
      }
    }

    return {
      documents,
      categories,
      isLoading,
      loadDocList,
      loadDocument,
      uploadDocument,
      createTextKnowledge,
      deleteDocument,
      modifyDocument,
      updateDocumentStatus,
    }
  },
  // persist配置
  {
    // persist: {
    //   paths: ['documents', 'isLoading'],
    // },
  },
)
