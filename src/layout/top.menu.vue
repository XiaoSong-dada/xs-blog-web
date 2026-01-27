<template>
    <a-tabs class="top-menu" v-model:activeKey="activeKey" centered type="line" :tabBarGutter="80"
        @change="handleTabChange">
        <a-tab-pane v-for="item in homeTopMenu" :key="item.key" :tab="item.label" />
        <template #rightExtra>
            sdaa
        </template>
    </a-tabs>
</template>

<script setup lang="ts">
import { homeTopMenu } from '@/router/home.top.menu';
import { ref ,reactive, onMounted } from 'vue';
import { Tabs , TabPane} from 'ant-design-vue';
import type { HomeTopMenuItem } from '@/types/main';
import { useRouter } from 'vue-router';

const ATabs = Tabs;
const ATabPane = TabPane;
const homeTopMenuMap = reactive(new Map<string, HomeTopMenuItem>());
const router = useRouter();
const activeKey = ref('1');

onMounted(() =>{
    homeTopMenu.forEach(item =>{
        homeTopMenuMap.set(item.key,item);
    });
})

const handleTabChange = (key: string | number) => {
    const item = homeTopMenuMap.get(key as string);
    if (item) router.push(item.route);
}
</script>

<style scoped lang="scss">
    .top-menu {}
</style>