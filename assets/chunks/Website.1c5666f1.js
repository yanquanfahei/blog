import{h as p,o as s,c as i,b as e,t as o,F as a,r as u,i as h}from"../app.f6ae43d3.js";const _={class:"item-wrap p-4"},f={class:"img-wrap mr-2"},w=["src"],k={class:"info"},b={class:"title font-600 text-5"},j={class:"desc text-2"},x=p({__name:"WebsiteItem",props:{item:null},setup(t){const n=t;function r(){window.location.href=n.item.link}return(c,m)=>(s(),i("div",_,[e("div",{class:"item flex cursor-pointer",onClick:r},[e("div",f,[e("img",{class:"w-10 h-10",src:t.item.pic,alt:"pic"},null,8,w)]),e("div",k,[e("div",b,o(t.item.title),1),e("div",j,o(t.item.desc),1)])])]))}}),y={class:"website-container"},V={class:"section-title mb-4 font-600 text-4"},S={class:"section-items flex flex-wrap"},C=p({__name:"Website",setup(t){const c=[{title:"Vue生态",list:[{title:"Vue",desc:"The Progressive JavaScript Framework",link:"https://vuejs.org/",pic:"https://router.vuejs.org/logo.png"},{title:"Vue Router",desc:"The official router for Vue.js",link:"https://router.vuejs.org/",pic:"https://router.vuejs.org/logo.png"},{title:"Nuxt",desc:"The Intuitive Vue Framework",link:"https://nuxtjs.org/",pic:"https://avatars.githubusercontent.com/u/23360933?s=200&v=4"},{title:"Pinia",desc:"The Vue Store that you will enjoy using",link:"https://pinia.vuejs.org/",pic:"https://pinia.vuejs.org/logo.svg"},{title:"Vuex",desc:"Vuex is a state management pattern + library for Vue.js",link:"https://vuex.vuejs.org/",pic:"https://router.vuejs.org/logo.png"},{title:"VitePress",desc:"Simple, powerful, and performant. Meet the modern SSG framework you've always wanted.",link:"https://vitepress.vuejs.org/",pic:"https://router.vuejs.org/logo.png"},{title:"VuePress",desc:"Vue-powered Static Site Generator",link:"https://vuepress.vuejs.org/",pic:"https://vuepress.vuejs.org/hero.png"},{title:"vueuse",desc:"Collection of Vue Composition Utilities",link:"https://vueuse.org/",pic:"https://d33wubrfki0l68.cloudfront.net/2f6479d73bc25170dc532dd42e059166573bf478/61057/favicon.svg"},{title:"awesome-vue",desc:"Components & Libraries",link:"https://github.com/vuejs/awesome-vue#components--librariese",pic:"https://github.com/vuejs/awesome-vue/raw/master/assets/logo.svg"}]},{title:"资源压缩",list:[{title:"tinify",desc:"Smart WebP, PNG and JPEG compression",link:"https://tinify.cn/",pic:"https://tinify.cn/images/panda-chewing-2x.png"},{title:"iLoveIMG",desc:"可批量编辑图片 的所有工具",link:"https://www.iloveimg.com/zh-cn",pic:"https://www.iloveimg.com/img/iloveimg.svg"}]}];return(m,P)=>(s(),i("div",y,[(s(),i(a,null,u(c,(l,v)=>e("div",{key:v,class:"website-section rd-2 px-4 py-2 mb-8"},[e("div",V,o(l.title),1),e("div",S,[(s(!0),i(a,null,u(l.list,(d,g)=>(s(),h(x,{key:g,item:d},null,8,["item"]))),128))])])),64))]))}});export{C as default};
