<template>
  <div class="vditor-view">
    <div ref="elRef" class="vditor-reset"></div>
    <div v-if="previewVisible" class="image-preview-mask" @click="closePreview">
      <img class="image-preview-img" :src="previewSrc" alt="preview" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch } from "vue";
import { config } from "@/config/config";
import { useComputedUrl } from "@/hook/file/useFile";
import Vditor from "vditor";
import "vditor/dist/index.css";

const props = defineProps<{
  markdown: string,
}>()
const emit = defineEmits<{
  (event: "rendered", el: HTMLElement): void;
}>()

const elRef = ref<HTMLDivElement | null>(null)
const previewVisible = ref(false)
const previewSrc = ref("")
const { computeImageUrl } = useComputedUrl()

let clickHandler: ((e: Event) => void) | null = null
let keyHandler: ((e: KeyboardEvent) => void) | null = null

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
  normalizePreviewImageUrls()
  emit("rendered", elRef.value)
  bindImageClick()
}

onBeforeUnmount(() => {
  if (elRef.value && clickHandler) {
    elRef.value.removeEventListener("click", clickHandler)
  }
  if (keyHandler) {
    window.removeEventListener("keydown", keyHandler)
  }
})

function bindImageClick() {
  if (!elRef.value) return
  if (clickHandler) {
    elRef.value.removeEventListener("click", clickHandler)
  }
  clickHandler = (e: Event) => {
    const target = e.target as HTMLElement | null
    if (!target || target.tagName !== "IMG") return
    const img = target as HTMLImageElement
    if (!img.src) return
    e.preventDefault()
    previewSrc.value = img.src
    previewVisible.value = true
  }
  elRef.value.addEventListener("click", clickHandler)

  if (!keyHandler) {
    keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePreview()
      }
    }
    window.addEventListener("keydown", keyHandler)
  }
}

function normalizePreviewImageUrls() {
  if (!elRef.value) return

  const images = elRef.value.querySelectorAll("img")
  images.forEach((img) => {
    const rawSrc = img.getAttribute("src")
    const normalizedSrc = computeImageUrl(rawSrc)
    if (normalizedSrc) {
      img.setAttribute("src", normalizedSrc)
    }
  })
}

function closePreview() {
  previewVisible.value = false
  previewSrc.value = ""
}

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
  width: 100%;
}

.image-preview-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
}

.image-preview-img {
  max-width: 96vw;
  max-height: 96vh;
  object-fit: contain;
  background: #fff;
  border-radius: 6px;
}
</style>
