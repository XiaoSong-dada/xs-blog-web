<template>
    <a-layout class="center-layout cover-width-height">
        <a-layout-content class="cover-width-height content">
            <router-view />
        </a-layout-content>
    </a-layout>
</template>

<script setup lang="ts">
import { Layout } from 'ant-design-vue';
import { onMounted, reactive } from 'vue';
import { centerMenu } from '@/constants/center-menu';
const ALayout = Layout;
const ALayoutContent = Layout.Content;

const emit = defineEmits(['menu-select']);
const menuItemMap = reactive(new Map<string, string>());

onMounted(() => {
    centerMenu.forEach(item => {
        menuItemMap.set(item.key, item.route)
    })
})
</script>

<style scoped lang="scss">
.center-layout {
    height: 100%;

    .content {
        padding: 5px;
    }
}
</style>
