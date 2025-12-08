// 结构化分类数据 - 包含完整的层级关系
export const initialCategories = [
  {
    id: 'checkin',
    name: '招商入驻',
    icon: 'Document',
    children: [
      { id: 'checkin-1', name: '入驻与退出', key: 'checkin_exit' },
      { id: 'checkin-2', name: '保证金管理', key: 'deposit' },
    ],
  },
  {
    id: 'finance',
    name: '资金结算',
    icon: 'Money',
    key: 'finance',
    children: [],
  },
  {
    id: 'product',
    name: '商品管理',
    icon: 'Goods',
    children: [
      { id: 'product-1', name: '商品发布', key: 'product_publish' },
      { id: 'product-2', name: '商品质量', key: 'product_quality' },
    ],
  },
  {
    id: 'operation',
    name: '经营成长',
    icon: 'TrendCharts',
    key: 'operation',
    children: [],
  },
  {
    id: 'violation',
    name: '违规管理',
    icon: 'Warning',
    children: [
      { id: 'violation-1', name: '管理总则', key: 'violation_general' },
      { id: 'violation-2', name: '违规总则', key: 'violation_rules' },
    ],
  },
  {
    id: 'detail',
    name: '实施细则',
    icon: 'List',
    key: 'detail',
    children: [],
  },
  {
    id: 'rules',
    name: '规则解读',
    icon: 'Reading',
    key: 'rules',
    children: [],
  },
]
