<template>
    <nav class="top-tag" aria-label="顶部导航">
        <button
            v-for="item in items"
            :key="item.key"
            type="button"
            class="top-tag-item"
            :class="{ 'is-active': item.key === activeKey }"
            @click="emit('change', item.key)"
        >
            {{ item.label }}
        </button>
    </nav>
</template>

<script setup lang="ts">
import type { HomeTopMenuItem } from '@/types/main';

defineProps<{
    items: HomeTopMenuItem[];
    activeKey: string;
}>();

const emit = defineEmits<{
    (e: 'change', key: string): void;
}>();
</script>

<style scoped lang="scss">
.top-tag {
    height: 100%;
    display: flex;
    align-items: stretch;
    gap: 8px;
    overflow: hidden;
}

.top-tag-item {
    border: none;
    background: transparent;
    color: #595959;
    font-size: 15px;
    line-height: 1;
    padding: 0 6px;
    margin: 0;
    height: 100%;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    transition: color 0.2s ease;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        border-radius: 999px;
        transform: scaleX(0);
        transform-origin: center;
        transition: transform 0.2s ease;
        background: #1677ff;
    }

    &:hover {
        color: #1677ff;
    }

    &.is-active {
        color: #1677ff;
        font-weight: 500;

        &::after {
            transform: scaleX(1);
        }
    }
}
</style>