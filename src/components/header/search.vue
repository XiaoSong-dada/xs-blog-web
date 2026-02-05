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
    (e:"SearchArticle", kw: string): void;
    (e:"ClearArticle"):void;
}>()

const search = (val: string) => {
    if(val){
        emit('SearchArticle', val);
    }
}

watch(
 searchValue,
 (val) => {
    if(!val){
        emit('ClearArticle')
    }
}
)

</script>

<style scoped lang="scss"></style>