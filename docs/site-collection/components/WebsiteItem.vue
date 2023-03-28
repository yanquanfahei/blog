<script setup lang="ts">
const props = defineProps<{
  item: {
    title: string
    desc: string
    link: string
    pic: string
  }
}>()

function onClick() {
  window.location.href = props.item.link
}
</script>
<template>
  <div class="item-wrap">
    <div class="item flex cursor-pointer" @click="onClick">
      <div class="img-wrap mr-2 shrink-0">
        <img class="w-10 h-10" :src="item.pic" alt="pic" />
      </div>
      <div class="info overflow-hidden">
        <div class="title font-600 text-5">
          {{ item.title }}
        </div>
        <div class="desc text-2 truncate w-full">
          {{ item.desc }}
        </div>
      </div>
    </div>
  </div>
</template>
