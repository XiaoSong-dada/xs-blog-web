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
const emit = defineEmits<{
  (event: "rendered", el: HTMLElement): void;
}>()

const elRef = ref<HTMLDivElement | null>(null)

async function render(md: string) {
  if (!elRef.value) return
  await Vditor.preview(elRef.value, md, {
    mode: "light",
    cdn: config.VITE_VDITOR_CDN,
    lang: "zh_CN",
    markdown:{
      toc:true
    }
  })
  emit("rendered", elRef.value)
}

onMounted(() => {
})

watch(
  () => props.markdown,
  (md) => {
    render(md)
  },
)
</script>

<style scoped lang="scss">
.vditor-view {
  height: 100%;
}
</style>
