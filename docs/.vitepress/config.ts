import { defineConfig, DefaultTheme } from 'vitepress'
import sourceCodeRead from './catalogues/source-code-read'
import nodejs from './catalogues/nodejs'
import siteCollection from './catalogues/site-collection'
import dataStructureAndAlgorithm from './catalogues/data-structure-and-algorithm'

const nav: DefaultTheme.NavItem[] = [
  sourceCodeRead,
  nodejs,
  siteCollection,
  dataStructureAndAlgorithm
]

const sidebar: DefaultTheme.Sidebar = {
  '/source-code-read/': [sourceCodeRead],
  '/nodejs/': [nodejs],
  '/data-structure-and-algorithm/': [dataStructureAndAlgorithm]
}

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
    sidebar,
    editLink: {
      pattern: 'https://github.com/yanquanfahei/blog/blob/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yanquanfahei/blog' }
    ]
  }
})
