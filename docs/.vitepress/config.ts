import { defineConfig } from 'vitepress'

const nav = []

const sidebar = []

export default defineConfig({
  lang: 'zh-CN',
  title: '眼圈发黑',
  description: '前端知识体系学习博客',
  lastUpdated: true,
  base: '/blog',
  themeConfig: {
    siteTitle: 'My Blog',
    logo: '/logo.png',
    lastUpdatedText: '最后更新',
    nav,
    sidebar
  }
})
