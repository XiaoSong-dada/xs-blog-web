<template>
    <div class="login">
        <a-card class="login-container">
            <template #title>
                <div class="card-title">登录</div>
            </template>
            <a-form :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
                <a-form-item>
                    <a-input v-model:value="formState.user" placeholder="用户名">
                        <template #prefix>
                            <UserOutlined class="icon-class" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-input v-model:value="formState.password" type="password" placeholder="密码">
                        <template #prefix>
                            <LockOutlined class="icon-class" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" html-type="submit" class="login-button" @click="handleLogin">
                        登录
                    </a-button>
                    <p>还没有账号？点击<a @click="handleRegister">注册</a>一个账号</p>
                </a-form-item>
            </a-form>
        </a-card>
    </div>


</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { Form, Input, Button, Card, message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import type { UnwrapRef } from 'vue';
import type { FormProps } from 'ant-design-vue';
import type { UserLoginData } from '@/types/main';
import { login as loginApi } from '@/api/user/user';
import { useRouter } from 'vue-router';
import { AuthService } from '@/service/auth.service';
import { isNull } from '@/utils/verification';
const router = useRouter();
const AForm = Form;
const AFormItem = Form.Item;
const AInput = Input;
const AButton = Button;
const ACard = Card;

interface FormState {
    user: string;
    password: string;
}
const formState: UnwrapRef<FormState> = reactive({
    user: '',
    password: '',
});
const handleFinish: FormProps['onFinish'] = values => {
};
const handleFinishFailed: FormProps['onFinishFailed'] = errors => {
};

const handleLogin = async () => {
    const data: UserLoginData = {
        username: formState.user,
        password: formState.password,
    };

    let checked = true;
    const require_array: { key: keyof UserLoginData, message: string }[] = [
        {
            key: 'username',
            message: '用户名不能为空'
        },
        {
            key: 'password'
            , message: '密码不能为空'
        }
    ]
    require_array.forEach(item => {
        data[item.key as keyof UserLoginData]
        if (isNull(item)) return message.warn(item.message)
    })

    if (!checked) return;

    loginApi(data).then(res => {
        if (res.code === 200) {
            AuthService.setToken(res.data?.token || '')
            router.push({ path: '/' })
        }
    });

};

const handleRegister = () => {
    router.push({ path: '/register' })
}

</script>
<style scoped lang="scss">
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('../../assets/login.png') center/cover no-repeat;

    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .login-container {
        width: 350px;
        margin-right: 100px;

        .card-title {
            width: 100%;
        }

        .login-button {
            width: 100%;
        }

        .icon-class {
            color: rgba(0, 0, 0, 0.25);
        }

    }
}
</style>
