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
      },
      {
        text: 'vue3-shared',
        link: '/source-code-read/vue3-shared'
      },
      {
        text: 'vue3-release',
        link: '/source-code-read/vue3-release'
      },
      {
        text: 'update-notifier',
        link: '/source-code-read/update-notifier'
      },
      {
        text: 'validate-npm-package-name',
        link: '/source-code-read/validate-npm-package-name'
      },
      {
        text: 'emitter',
        link: '/source-code-read/emitter'
      },
      {
        text: 'create-vue',
        link: '/source-code-read/create-vue'
      },
      {
        text: 'configstore',
        link: '/source-code-read/configstore'
      }
    ]
  }
]

const sidebar: DefaultTheme.Sidebar = {
  '/source-code-read/': [
    {
      text: '源码阅读系列',
      collapsible: true,
      items: nav as DefaultTheme.SidebarItem[]
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
