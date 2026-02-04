<template>
    <nav ref="tocRef" class="vditor-toc"></nav>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";

const props = defineProps<{
    scrollContainer?: HTMLElement | null;
    offsetTop?: number;
}>();

const tocRef = ref<HTMLElement | null>(null);
let clickHandler: ((event: Event) => void) | null = null;

function render(contentEl: HTMLElement | null) {
    if (!tocRef.value || !contentEl) return;
    Vditor.outlineRender(contentEl, tocRef.value);
    bindScrollHandler();
}

function bindScrollHandler() {
    if (!tocRef.value) return;
    if (clickHandler) {
        tocRef.value.removeEventListener("click", clickHandler, true);
    }
    clickHandler = (event: Event) => {
        const target = event.target as HTMLElement | null;
        if (!target) return;
        if (target.closest(".vditor-outline__action")) {
            return;
        }
        const linkEl = target.closest("[data-target-id]") as HTMLElement | null;
        if (!linkEl) return;
        const id = linkEl.getAttribute("data-target-id");
        if (!id) return;
        const idElement = document.getElementById(id);
        if (!idElement) return;
        event.preventDefault();
        event.stopPropagation();
        const scrollEl = props.scrollContainer;
        const offsetTop = props.offsetTop ?? 0;
        if (scrollEl) {
            const top =
                idElement.getBoundingClientRect().top -
                scrollEl.getBoundingClientRect().top +
                scrollEl.scrollTop -
                offsetTop;
            scrollEl.scrollTo({ top, behavior: "smooth" });
        } else {
            idElement.scrollIntoView({ block: "start", behavior: "smooth" });
        }
    };
    tocRef.value.addEventListener("click", clickHandler, true);
}

onBeforeUnmount(() => {
    if (tocRef.value && clickHandler) {
        tocRef.value.removeEventListener("click", clickHandler, true);
    }
});

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
