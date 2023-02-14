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
  <div class="item-wrap p-4">
    <div class="item flex cursor-pointer" @click="onClick">
      <div class="img-wrap mr-2">
        <img class="w-10 h-10" :src="item.pic" alt="pic" />
      </div>
      <div class="info">
        <div class="title font-600 text-5">
          {{ item.title }}
        </div>
        <div class="desc text-2">
          {{ item.desc }}
        </div>
      </div>
    </div>
  </div>
</template>
