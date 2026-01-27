<template>
    <a-menu-divider v-if="props.data.before_need_driver"/>
    <a-menu-item :key="props.data.key" @click="emit('click', props.data)">
        <div class="flex-evenly align-center menu-item">
            <img :src="`../../assets/icon/${props.data.icon}.svg`" v-if="props.data.icon" style="height: 22px;">
            <div>
                {{ props.data.label }}
            </div>
        </div>
    </a-menu-item>
</template>

<script setup lang="ts">
import type { IItemCompoment } from '@/types/main'
import { Menu } from 'ant-design-vue';

const AMenuItem = Menu.Item;
const AMenuDivider = Menu.Divider;

const props = defineProps<IItemCompoment>()
const emit = defineEmits<{
  (e: 'click', item: IItemCompoment['data']): void
}>()


</script>

<style scoped lang="scss">
</style>
