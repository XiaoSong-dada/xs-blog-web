<template>
    <div class="user-drop-down flex-end align-center">
        <a-dropdown class="flex-end align-center">
            <slot name="image"></slot>
            <template #overlay>
                <a-menu>
                    <a-menu-item key="0">
                        <a>我的创作</a>
                    </a-menu-item>
                    <a-menu-item key="1">
                        <a>个人中心</a>
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="3">退出</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script setup lang="ts">
import type { IDropDown } from '@/types/main'
import { Dropdown } from 'ant-design-vue';
import { Menu, MenuItem , MenuDivider } from 'ant-design-vue';

const ADropdown = Dropdown;
const AMenu = Menu;
const AMenuItem = MenuItem;
const AMenuDivider = MenuDivider;

const props = defineProps<IDropDown>()

</script>

<style scoped></style>