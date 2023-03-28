---
layout: page
---

<script setup>
import { defineAsyncComponent } from 'vue'
const WebSite = defineAsyncComponent(() => import('./components/Website.vue'))
</script>

<WebSite />
