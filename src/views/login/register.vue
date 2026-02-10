<template>
    <div class="register">
        <a-card class="register-container">
            <template #title>
                <div class="flex-between">
                    <div class="card-title flex-center flex-column">注册</div>
                    <a-button @click="goToLogin">
                        <ArrowLeftOutlined />
                        返回登录
                    </a-button>
                </div>
            </template>
            <a-form :model="user" labelAlign="left" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-form-item label="用户名">
                    <a-input v-model:value="user.username" placeholder="用户名">
                        <template #prefix>
                            <UserOutlined class="icon-class" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="密码">
                    <a-input v-model:value="user.password" type="password" placeholder="密码">
                        <template #prefix>
                            <LockOutlined class="icon-class" />

                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="昵称">
                    <a-input v-model:value="user.nick_name" placeholder="昵称">
                        <template #prefix>
                            <ContactsOutlined class="icon-class" />

                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="邮箱">
                    <a-input v-model:value="user.email" type="email" placeholder="邮箱">
                        <template #prefix>
                            <MailOutlined class="icon-class" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="验证码">

                    <a-input-search v-model:value="user.code" placeholder="验证码">
                        <template #prefix>
                            <KeyOutlined class="icon-class" />
                        </template>
                        <template #enterButton>
                            <a-button @click="sendRegisterCode" :disabled="isSending">{{ sendLable }}</a-button>
                        </template>
                    </a-input-search>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 24 }">
                    <a-button block type="primary" html-type="submit" @click="registerUser" class="button">
                        注册
                    </a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { Form, Input, Button, Card, InputSearch } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useRegister } from '@/hook/register/useRegister';
import { ArrowLeftOutlined, ContactsOutlined, MailOutlined, KeyOutlined } from '@ant-design/icons-vue';
const router = useRouter();
const AForm = Form;
const AFormItem = Form.Item;
const AInput = Input;
const AButton = Button;
const ACard = Card;
const AInputSearch = InputSearch;

const { user, sendRegisterCode, sendLable, isSending , registerUser} = useRegister();

const goToLogin = () => {
    router.push({ path: '/login' })
}

</script>
<style scoped lang="scss">
.register {
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('../../assets/login.png') center/cover no-repeat;

    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .register-container {
        width: 400px;
        margin-right: 100px;

        .card-title {
            width: 100%;
        }

        .icon-class {
            color: rgba(0, 0, 0, 0.25);
        }

    }
}
</style>
