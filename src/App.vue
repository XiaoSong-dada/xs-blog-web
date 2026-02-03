<script setup lang="ts">
import { message } from 'ant-design-vue';

const [, ContextHolder] = message.useMessage();
</script>

<template>
  <div class="app-root">
    <ContextHolder />
    <router-view class="app-view" />
  </div>
</template>
