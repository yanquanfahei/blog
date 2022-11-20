import { lstatSync } from 'fs'
import { defineConfig, DefaultTheme } from 'vitepress'
import fg, { Entry } from 'fast-glob'

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
      }
    ]
  }
]

function getSidebarItems(
  files: Entry[],
  indexName: string
): DefaultTheme.SidebarItem[] {
  const result: DefaultTheme.SidebarItem[] = []

  files.sort(
    (a, b) =>
      new Date(lstatSync(a.path).ctime).getTime() -
      new Date(lstatSync(b.path).ctime).getTime()
  )
  for (const file of files) {
    const { name, path } = file

    result.push({
      text: name === 'index.md' ? indexName : name.replace(/\.md$/, ''),
      link:
        name === 'index.md'
          ? path.replace(/docs|index\.md$/g, '')
          : path.replace(/docs|\.md$/g, '')
    })
  }
  return result
}

const sourceCodeReadFiles = fg.sync(['docs/source-code-read/*.md'], {
  objectMode: true
})

const sourceCodeReadSlider = getSidebarItems(sourceCodeReadFiles, '引导')

const sidebar: DefaultTheme.Sidebar = {
  '/source-code-read/': [
    {
      text: '源码阅读系列',
      collapsible: true,
      items: sourceCodeReadSlider
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
