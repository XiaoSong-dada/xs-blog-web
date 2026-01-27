<script setup lang="ts">
import { message } from 'ant-design-vue';

const [ContextHolder] = message.useMessage();
</script>

<template>
  <div class="app-root">
    <ContextHolder />
    <router-view class="app-view" />
  </div>
</template>

<style scoped>
.app-root,
.app-view {
  width: 100%;
  height: 100%;
}
</style>
