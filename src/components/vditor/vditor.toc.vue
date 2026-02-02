<template>
    <nav ref="tocRef" class="vditor-toc"></nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";

const tocRef = ref<HTMLElement | null>(null);

function render(contentEl: HTMLElement | null) {
    if (!tocRef.value || !contentEl) return;
    Vditor.outlineRender(contentEl, tocRef.value);
}

defineExpose({ render });
</script>

<style scoped lang="scss">
.vditor-toc {
    position: sticky;
    top: 12px;
    width: 200px;
    color: #707070;
}

</style>
