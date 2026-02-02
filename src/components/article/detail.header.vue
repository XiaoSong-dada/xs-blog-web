<template>
    <div class="detail-header">
        {{ detailData?.title }}
        <div>
            <span>
                {{ detailData?.created_at }}
            </span>
            <span>
                {{ detailData?.author_id }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IArticle } from '@/types/main';
import { formatDate } from '@/utils/date';
import { onMounted, ref,watch } from 'vue'

const props = defineProps<{ data: IArticle | null }>()
const detailData = ref<IArticle>();

onMounted(async () => {
    if (props.data) {
        detailData.value = props.data;
        // 格式化数据
        detailData.value.created_at = formatDate(detailData.value?.created_at)
        console.log('do this ');
        
    }

})

watch(
  () => props.data,
  (val) => {
    if (!val) return;
    detailData.value = { ...val };
    detailData.value.created_at = formatDate(detailData.value.created_at);
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.detail-header {
    height: 100px;
}
</style>