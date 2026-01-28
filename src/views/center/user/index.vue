<template>
    <div class="center-user">
        <a-flex class="header" :gap="40">
            <a-flex gap="small">
                <a-flex class="search-item">
                    <text>
                        用户名：
                    </text>
                    <div class="flex-center flex-column">
                        <a-input />
                    </div>
                </a-flex>
                <a-flex class="search-item">
                    <text>
                        昵称：
                    </text>
                    <div class="flex-center flex-column">
                        <a-input />
                    </div>
                </a-flex>
                <a-flex class="search-item">
                    <text>
                        邮箱：
                    </text>
                    <div class="flex-center flex-column">
                        <a-input />
                    </div>
                </a-flex>
            </a-flex>
            <a-flex gap="small" align="center">
                <a-button type="primary" :icon="h(PlusOutlined)">搜素</a-button>
                <a-button :icon="h(PlusOutlined)">重置</a-button>
            </a-flex>
        </a-flex>
        <a-flex class="tools">
            <a-button type="primary" :icon="h(PlusOutlined)">新增</a-button>
        </a-flex>
        <a-table :columns="columns" :data-source="data">
            <template #headerCell="{ column }">
                <template v-if="column.key === 'name'">
                    <span>
                        <smile-outlined />
                        Name
                    </span>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { Table, Button, Flex, Input } from 'ant-design-vue';
import { SmileOutlined } from '@ant-design/icons-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useUserList } from '@/hook/user/useUser';
import { h } from 'vue'
const ATable = Table;
const AButton = Button;
const AFlex = Flex;
const AInput = Input;

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
    }
];

const { data } = useUserList({});

</script>

<style scoped lang="scss">
.center-user {

}
</style>