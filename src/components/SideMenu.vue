<template>
  <!-- 添加unique-opened属性确保单一展开 -->
  <el-menu class="el-menu-vertical-demo side-menu" :default-active="currentActive" @select="handleSelect" unique-opened>
    <!-- 有子分类的菜单使用el-sub-menu -->
    <el-sub-menu v-for="item in menuTree.filter(i => i.children && i.children.length)" :key="item.id" :index="item.id">
      <template #title>
        <el-icon :size="20">
          <component :is="iconMap[item.icon]" />
        </el-icon>
        {{ item.name }}
      </template>
      <!-- 修改el-menu-item的点击事件，传递一级分类ID和二级分类ID -->
      <el-menu-item v-for="(sub, i) in item.children" :key="sub.id" :index="`${item.id}-${i}`"
        @click="handleMenuItemClick(item.id, sub.id)">
        {{ sub.name }}
      </el-menu-item>
    </el-sub-menu>

    <!-- 无子分类的菜单直接使用el-menu-item -->
    <el-menu-item v-for="item in menuTree.filter(i => !i.children || !i.children.length)" :key="item.id"
      :index="item.id" @click="handleMenuItemClick(item.id)">
      <el-icon :size="20">
        <component :is="iconMap[item.icon]" />
      </el-icon>
      {{ item.name }}
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ElMenu, ElSubMenu, ElMenuItem } from 'element-plus'
import { Document, Money, Goods, TrendCharts, Warning, Reading, List } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { initialCategories } from '@/constants/categories'
const menuTree = initialCategories

// 添加图标组件映射表
const iconMap = {
  Document,
  Money,
  Goods,
  TrendCharts,
  Warning,
  Reading,
  List
}
// 添加当前激活菜单的响应式变量，并从localStorage读取初始值
const savedActive = JSON.parse(localStorage.getItem('sideMenuActive') || '{}')
const currentActive = ref('')

// 组件挂载时恢复状态
onMounted(() => {
  if (savedActive.parentId) {
    // 恢复菜单高亮状态
    currentActive.value = savedActive.subId
      ? `${savedActive.parentId}-${savedActive.subId}`
      : savedActive.parentId

    // 移除接口调用，仅恢复UI状态
    // handleMenuItemClick(savedActive.parentId, savedActive.subId);
  }
})

/* ========== 菜单事件处理 ========== */
const handleSelect = (index) => {
  console.log('Selected menu index:', index)
  // 解析一级和二级分类ID
  const [parentId, subId] = index.split('-')

  // 更新当前激活菜单
  currentActive.value = index

  // 存储对象格式到localStorage，同时保留一级和二级分类
  localStorage.setItem('sideMenuActive', JSON.stringify({
    parentId,
    subId: subId || null  // 二级分类不存在时存储为null
  }))
}

// 添加事件发射定义
const emit = defineEmits(['categorySelected']);

// 修改点击处理函数，发射分类选择事件
// 修改点击处理函数，移除anchor相关代码
const handleMenuItemClick = (parentId, subId) => {
  // 发射一级分类ID和二级分类ID
  emit('categorySelected', parentId, subId);
}
</script>

<style>
.side-menu {
  width: 200px;
  font-size: 14px;
  line-height: 36px;
  user-select: none;
}

/* 场景栏样式 - 缩进2字符并颜色变浅 */
.side-menu .el-sub-menu .el-menu-item {
  margin-left: 2ch;
  /* 缩进2字符 */
}

/* 一级菜单选中样式 */
.side-menu .el-sub-menu.is-active .el-sub-menu__title {
  color: #03284d;
  font-weight: bold;
  /* background-color: #e6f7ff; */
}

/* 二级菜单选中样式 */
.side-menu .el-menu-item.is-active {
  color: #409EFF;
  font-weight: bold;
  /* background-color: #e6f7ff; */
  border-right: 3px solid #409EFF;
}
</style>