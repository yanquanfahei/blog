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
      },
      {
        text: 'vue-dev-server',
        link: '/source-code-read/vue-dev-server'
      },
      {
        text: 'ni',
        link: '/source-code-read/ni'
      },
      {
        text: 'open',
        link: '/source-code-read/open'
      },
      {
        text: 'remote-git-tags',
        link: '/source-code-read/remote-git-tags'
      },
      {
        text: 'element-ui-init-component',
        link: '/source-code-read/element-ui-init-component'
      },
      {
        text: 'only-allow',
        link: '/source-code-read/only-allow'
      },
      {
        text: 'js-cookie',
        link: '/source-code-read/js-cookie'
      },
      {
        text: 'delay',
        link: '/source-code-read/delay'
      },
      {
        text: 'install-pkg',
        link: '/source-code-read/install-pkg'
      },
      {
        text: 'await-to-js',
        link: '/source-code-read/await-to-js'
      },
      {
        text: 'dotenv',
        link: '/source-code-read/dotenv'
      },
      {
        text: 'classnames',
        link: '/source-code-read/classnames'
      },
      {
        text: 'read-pkg',
        link: '/source-code-read/read-pkg'
      },
      {
        text: 'quick-lru',
        link: '/source-code-read/quick-lru'
      },
      {
        text: 'taro-plugin-mini-ci',
        link: '/source-code-read/taro-plugin-mini-ci'
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
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yanquanfahei/blog' }
    ]
  }
})
