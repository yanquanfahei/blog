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
  <div class="website-container">
    <!-- 压缩网站 -->
    <div
      v-for="(webSite, siteIdx) in websiteSet"
      :key="siteIdx"
      class="website-section rd-2 px-4 py-2 mb-8"
    >
      <div class="section-title mb-4 font-600 text-4">
        {{ webSite.title }}
      </div>
      <div class="section-items flex flex-wrap">
        <template v-for="(item, idx) in webSite.list" :key="idx">
          <WebsiteItem :item="item" />
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.website-section {
  background-color: var(--vp-c-bg-soft);
}
</style>
