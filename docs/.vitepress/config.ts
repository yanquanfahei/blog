import { defineConfig, DefaultTheme } from 'vitepress'

const nav: DefaultTheme.NavItem[] = [
  {
    text: '源码阅读系列',
    items: [
      {
        text: '引导',
        link: '/source-code-read/'
      },
      {
        text: 'launch-editor',
        link: '/source-code-read/launch-editor'
      }
    ]
  }
]

const sidebar: DefaultTheme.Sidebar = {
  '/source-code-read/': [
    {
      text: '源码阅读系列',
      collapsible: true,
      items: [
        { text: '引导', link: '/source-code-read/' },
        {
          text: 'launch-editor',
          link: '/source-code-read/launch-editor'
        }
      ]
    }
  ]
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
    }
  }
})
