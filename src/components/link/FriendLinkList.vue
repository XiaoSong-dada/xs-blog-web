<template>
  <div class="friend-list-container">
    <a-list
      class="friend-list"
      :data-source="props.data"
    >
      <template #renderItem="{ item }">
        <a-list-item class="friend-list-item">
          <a :href="item.url" target="_blank" rel="noopener" class="friend-link">
            <div class="link-card">
              <div class="link-title">{{ item.name }}</div>
              <div v-if="item.description" class="link-desc">{{ item.description }}</div>
            </div>
          </a>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import type { IFriendLink } from '@/types/main';
import { List } from 'ant-design-vue';
const AList = List;
const props = withDefaults(defineProps<{
  data?: IFriendLink[]
}>(), {
  data: () => []
})

</script>

<style scoped lang="scss">
.friend-list-container {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.friend-list {
  width: min(90vw, 800px);
}

.friend-list :deep(.ant-list) {
  border: none;
}

/* Ant Design Vue list items live inside .ant-list-items */
.friend-list :deep(.ant-list-items) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.friend-list-item {
  padding: 0;
}

.friend-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.link-card {
  padding: 12px;
  background: var(--bg-color, #fff);
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.link-title {
  font-weight: 600;
  margin-bottom: 6px;
}

.link-desc {
  color: rgba(0,0,0,0.65);
  font-size: 13px;
}

@media (max-width: 800px) {
  .friend-list {
    width: 90vw;
  }
  .friend-list :deep(.ant-list-items) {
    grid-template-columns: 1fr;
  }
}

</style>