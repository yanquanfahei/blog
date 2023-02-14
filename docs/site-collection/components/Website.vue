<script setup lang="ts">
import WebsiteItem from './WebsiteItem.vue'

// vue 生态
const vueEcology = {
  title: 'Vue生态',
  list: [
    {
      title: 'Vue',
      desc: 'The Progressive JavaScript Framework',
      link: 'https://vuejs.org/',
      pic: 'https://avatars.githubusercontent.com/u/6128107?s=200&v=4'
    }
  ]
}

// 资源压缩
const compressWebsite = {
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
    },
    {
      title: 'iLoveIMG',
      desc: '可批量编辑图片 的所有工具',
      link: 'https://www.iloveimg.com/zh-cn',
      pic: 'https://www.iloveimg.com/img/iloveimg.svg'
    }
  ]
}

const websiteSet = [vueEcology, compressWebsite]
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
