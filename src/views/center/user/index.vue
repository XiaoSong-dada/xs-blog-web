<template>
    <div class="center-user">
        <a-flex class="header" :gap="40">
            <a-flex gap="small">
                <a-flex class="search-item">
                    <text>
                        用户名：
                    </text>
                    <div class="flex-center flex-column">
                        <a-input v-model:value="params.username" />
                    </div>
                </a-flex>
                <a-flex class="search-item">
                    <text>
                        昵称：
                    </text>
                    <div class="flex-center flex-column">
                        <a-input v-model:value="params.nick_name" />
                    </div>
                </a-flex>
                <a-flex class="search-item">
                    <text>
                        邮箱：
                    </text>
                    <div class="flex-center flex-column">
                        <a-input v-model:value="params.email" />
                    </div>
                </a-flex>
            </a-flex>
            <a-flex gap="small" align="center">
                <a-button type="primary" :icon="h(SearchOutlined)" @click="onSearch">搜索</a-button>
                <a-button :icon="h(ReloadOutlined)" @click="onReset">重置</a-button>
            </a-flex>
        </a-flex>
        <a-flex class="tools">
            <a-button type="primary" :icon="h(PlusOutlined)">新增</a-button>
        </a-flex>
        <a-table :columns="columns" :data-source="data" :loading="loading" :pagination="paginationComputed">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <a-button type="link" :icon="h(EditOutlined)">修改</a-button>
                    <a-button type="link" danger :icon="h(DeleteOutlined)">删除</a-button>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { Table, Button, Flex, Input } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useUserList } from '@/hook/user/useUser';
import { EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { computed, h, onMounted } from 'vue'

const ATable = Table;
const AButton = Button;
const AFlex = Flex;
const AInput = Input;
const { params, data, total, loading, fetchList, resetParams } = useUserList()
const columns = [
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '昵称',
        dataIndex: 'nick_name',
        key: 'nick_name',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
    },
    {
        title: '是否为管理员',
        key: 'is_admin',
        width: '150px'
    },
    {
        title: '头像',
        key: 'avatar_url',
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
    current: params.value.offset || 0,
    pageSize: params.value.limit || 10,
    total: total.value,
    showSizeChanger: true,
    onChange: onTableChange,
    onShowSizeChange: onTableChange,
    showTotal: () => `共 ${11} 条`
}))

onMounted(async () => {
    await fetchList()
})
</script>

<style scoped lang="scss">
.center-user {}
</style>
