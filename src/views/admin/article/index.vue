<template>
    <div class="center-article">
        <div class="toobar">
            <a-flex class="header" :gap="40">
                <a-flex gap="small">
                    <a-flex class="search-item">
                        <text>
                            标记：
                        </text>
                        <div class="flex-center flex-column">
                            <a-input v-model:value="params.slug" />
                        </div>
                    </a-flex>
                    <a-flex class="search-item">
                        <text>
                            标题：
                        </text>
                        <div class="flex-center flex-column">
                            <a-input v-model:value="params.title" />
                        </div>
                    </a-flex>
                    <a-flex class="search-item">
                        <text>
                            内容：
                        </text>
                        <div class="flex-center flex-column">
                            <a-input v-model:value="params.content_md" />
                        </div>
                    </a-flex>
                </a-flex>
                <a-flex gap="small" align="center">
                    <a-button type="primary" :icon="h(SearchOutlined)" @click="onSearch">搜索</a-button>
                    <a-button :icon="h(ReloadOutlined)" @click="onReset">重置</a-button>
                </a-flex>
            </a-flex>
            <a-flex class="tools" gap="small">
                <a-button type="primary" :icon="h(PlusOutlined)"
                    @click="() => router.push('./article/new')">新增</a-button>
                <a-button type="primary" danger :icon="h(CloseOutlined)" @click="notDevelopedMessage()">删除</a-button>
            </a-flex>
        </div>
        <a-table :columns="columns" :data-source="data" :scroll="{ x: '100%', y: computTableHeight }" :loading="loading"
            :pagination="paginationComputed" :row-selection="rowSelection" row-key="slug">
            <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'index'">
                    {{ buildIndex(params, index) }}
                </template>
                <template v-else-if="column.key === 'content_md'">
                    {{ omitString(record.content_md) }}
                </template>
                <template
                    v-if="['created_at', 'updated_at', 'published_at', 'deleted_at'].includes(String(column.key))">
                    {{ (column.key && record[column.key]) ? formatDate(record[column.key]) : '' }}
                </template>
                <template v-if="column.key === 'action'">
                    <a-button type="link" :icon="h(EditOutlined)" @click="updateArticle(record.id)">修改</a-button>
                    <a-popconfirm :title="`是否确认删除文章${record.slug}`" ok-text="确认" cancel-text="取消"
                        @confirm="notDevelopedMessage()">
                        <a-button type="link" danger :icon="h(DeleteOutlined)">删除</a-button>
                    </a-popconfirm>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { Table, Button, Flex, Input, Popconfirm, message } from 'ant-design-vue';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { useArticleList } from '@/hook/article/useArticle'
import { EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { computed, h, onMounted } from 'vue'
import { notDevelopedMessage } from '@/ui/status/not-developed';
import { formatDate } from '@/utils/date';
import { useBuildTableIndex } from '@/hook/useBuilding';
import { useRouter } from 'vue-router';
import { useTableHeight } from '@/hook/layout/useLayout';
import { omitString } from '@/utils/utils';

const ATable = Table;
const AButton = Button;
const AFlex = Flex;
const AInput = Input;
const APopconfirm = Popconfirm;
const { params, data, total, loading, fetchList, resetParams, rowSelection, selectedRows } = useArticleList();
const { buildIndex } = useBuildTableIndex();
const { tableHeight, tableHeightOnMounted } = useTableHeight();
const router = useRouter();

const columns = [
    {
        title: '序号',
        key: 'index',
        dataIndex: 'index',
        width: '80px'
    },
    {
        title: '标识',
        key: 'slug',
        width: '200px',
        dataIndex: 'slug'
    },
    {
        title: '标题',
        key: 'title',
        width: '200px',
        dataIndex: 'title'
    },
    {
        title: '内容',
        key: 'content_md',
        with: '150px',
        dataIndex: 'content_md'
    },
    {
        title: '浏览',
        key: 'view_count',
        width: '150px',
        dataIndex: 'view_count'
    },
    {
        title: '创建时间',
        key: 'created_at',
        width: '200px',
        dataIndex: 'created_at'
    },

    {
        title: '修改时间',
        key: 'updated_at',
        width: '200px',
        dataIndex: 'updated_at'
    },

    {
        title: '发布时间',
        key: 'published_at',
        width: '200px',
        dataIndex: 'published_at'
    },
    {
        title: '操作',
        key: 'action',
        width: '200px'
    },
];


const onSearch = () => {
    params.value.offset = 1
    fetchList()
}

const onReset = () => {
    resetParams()
    fetchList()
}

const onTableChange = (page: number, pageSize: number) => {
    params.value.offset = page
    params.value.limit = pageSize
    fetchList()
}

const paginationComputed = computed(() => ({
    current: params.value.offset || 1,
    pageSize: params.value.limit || 10,
    total: total.value,
    showSizeChanger: true,
    onChange: onTableChange,
    onShowSizeChange: onTableChange,
    showTotal: () => `共${total.value} 条`
}))

const updateArticle = (article_id: string): void => {
    router.push(`./article/edit/${article_id}`)
}


onMounted(async () => {
    await fetchList()
})
tableHeightOnMounted('content', 'toobar')
const computTableHeight = computed(() =>tableHeight.value)

</script>

<style scoped lang="scss">
.center-article {}
</style>
