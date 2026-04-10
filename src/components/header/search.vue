<template>
    <div class="top-menu-search">
        <a-input-search 
        v-model:value="searchValue" 
        enter-button 
        placeholder="搜索文章内容" 
        allowClear
        @search="search"
         />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { InputSearch } from 'ant-design-vue';
const AInputSearch = InputSearch;
const searchValue = ref<string>('');
const emit = defineEmits<{
    (e: 'search-article', kw: string): void;
    (e: 'clear-article'): void;
}>()

const search = (val: string) => {
    if(val){
        emit('search-article', val);
    }
}

watch(
 searchValue,
 (val) => {
    if(!val){
        emit('clear-article')
    }
}
)

</script>

<style scoped lang="scss">
.top-menu-search {
    width: 512px;
}
</style>