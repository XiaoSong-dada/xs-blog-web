<template>
    <div class="user-drop-down flex-end align-center">
        <a-dropdown class="flex-end align-center">
            <slot name="image"></slot>
            <template #overlay>
                <a-menu style="width: 100px;">
                    <drop-down-item :data="item" v-for="item in props.items" :key="item.key" @click="emit('select', item)"/>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script setup lang="ts">
import type { IDropDownItem } from '@/types/main'
import { Dropdown } from 'ant-design-vue';
import { Menu } from 'ant-design-vue';
import DropDownItem from './drop.down.item.vue';

const ADropdown = Dropdown;
const AMenu = Menu;
const props = defineProps<{items: IDropDownItem[]}>();
const emit = defineEmits<{
  (e: 'select', item: IDropDownItem): void
}>();

</script>

<style scoped lang="scss">
.user-drop-down {
    .menu-item {
        height: 30px;
        width: 200px;
    }
}
</style>