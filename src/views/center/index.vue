<template>
    <center-layout @menu-select="menuSelect"></center-layout>
</template>

<script setup lang="ts">
import CenterLayout from '@/layout/center/layout.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const menuSelect = (item: string) => {
    router.push(`/center/${item}`)
}

</script>

<style scoped></style>