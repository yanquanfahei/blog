<script setup lang="ts">
import WebsiteItem from './WebsiteItem.vue'

interface IWebsiteItem {
  title: string
  desc: string
  link: string
  pic: string
}

interface IWebsiteMap {
  title: string
  list: Array<IWebsiteItem>
}

// vue 生态
const vueEcology: IWebsiteMap = {
  title: 'Vue生态',
  list: [
    {
      title: 'Vue',
      desc: 'The Progressive JavaScript Framework',
      link: 'https://vuejs.org/',
      pic: 'https://router.vuejs.org/logo.png'
    },
    {
      title: 'Vue Router',
      desc: 'The official router for Vue.js',
      link: 'https://router.vuejs.org/',
      pic: 'https://router.vuejs.org/logo.png'
    },
    {
      title: 'Nuxt',
      desc: 'The Intuitive Vue Framework',
      link: 'https://nuxtjs.org/',
      pic: 'https://avatars.githubusercontent.com/u/23360933?s=200&v=4'
    },
    {
      title: 'Pinia',
      desc: 'The Vue Store that you will enjoy using',
      link: 'https://pinia.vuejs.org/',
      pic: 'https://pinia.vuejs.org/logo.svg'
    },
    {
      title: 'Vuex',
      desc: 'Vuex is a state management pattern + library for Vue.js',
      link: 'https://vuex.vuejs.org/',
      pic: 'https://router.vuejs.org/logo.png'
    },
    {
      title: 'VitePress',
      desc: "Simple, powerful, and performant. Meet the modern SSG framework you've always wanted.",
      link: 'https://vitepress.vuejs.org/',
      pic: 'https://router.vuejs.org/logo.png'
    },
    {
      title: 'VuePress',
      desc: 'Vue-powered Static Site Generator',
      link: 'https://vuepress.vuejs.org/',
      pic: 'https://vuepress.vuejs.org/hero.png'
    },
    {
      title: 'vueuse',
      desc: 'Collection of Vue Composition Utilities',
      link: 'https://vueuse.org/',
      // eslint-disable-next-line max-len
      pic: 'https://d33wubrfki0l68.cloudfront.net/2f6479d73bc25170dc532dd42e059166573bf478/61057/favicon.svg'
    },
    {
      title: 'awesome-vue',
      desc: 'Components & Libraries',
      link: 'https://github.com/vuejs/awesome-vue#components--librariese',
      pic: 'https://github.com/vuejs/awesome-vue/raw/master/assets/logo.svg'
    }
  ]
}

// 资源压缩
const compressWebsite: IWebsiteMap = {
  title: '资源压缩',
  list: [
    {
      title: 'tinify',
      desc: 'Smart WebP, PNG and JPEG compression',
      link: 'https://tinify.cn/',
      pic: 'https://tinify.cn/images/panda-chewing-2x.png'
    },
    {
      title: 'iLoveIMG',
      desc: '可批量编辑图片 的所有工具',
      link: 'https://www.iloveimg.com/zh-cn',
      pic: 'https://www.iloveimg.com/img/iloveimg.svg'
    }
  ]
}

const websiteSet: Array<IWebsiteMap> = [vueEcology, compressWebsite]
</script>
<template>
  <div class="website-container px-5 py-5 sm:px-12 md:px-18">
    <template v-for="(webSite, siteIdx) in websiteSet" :key="siteIdx">
      <div class="section-title mb-6 font-bold text-6">
        {{ webSite.title }}
      </div>
      <div class="website-section rd-2 p-6 mb-8">
        <div
          class="section-items grid gap-y-15 gap-x-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        >
          <template v-for="(item, idx) in webSite.list" :key="idx">
            <WebsiteItem :item="item" />
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less">
.website-section {
  background-color: var(--vp-c-bg-soft);
}
</style>
