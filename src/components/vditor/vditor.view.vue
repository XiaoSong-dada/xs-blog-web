<template>
  <div class="vditor-view">
    <div ref="elRef" class="vditor-reset"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { config } from '@/config/local.env';
import Vditor from "vditor";
import "vditor/dist/index.css";
interface HTMLDivElement extends HTMLElement {
  align: string
}
const props = defineProps<{
  markdown: string,
}>()

const elRef = ref<HTMLDivElement | null>(null)

function render(md: string) {
  if (!elRef.value) return
  Vditor.preview(elRef.value, md, {
    mode: "light",
    cdn: config.VITE_VDITOR_CDN,
    lang: "zh_CN",
  })
}

onMounted(() => {
})

watch(
  () => props.markdown,
  (md) => {
    console.log(md);
    
    render(md)
  },
)
</script>

<style scoped lang="scss">
.vditor-view {
  height: 100%;
}
</style>