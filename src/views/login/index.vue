<template>
    <div class="login">
        <a-card class="login-container">
            <template #title>
                <div class="card-title">登录</div>
            </template>
            <a-form :model="formState" @finish="handleLogin" @finishFailed="handleFinishFailed">
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
                    <a-button type="primary" html-type="submit" class="login-button" :loading="loginLoading">
                        登录
                    </a-button>
                    <p>还没有账号？点击<a @click="handleRegister">注册</a>一个账号</p>
                </a-form-item>
            </a-form>
            <Vcode
                :show="captchaVisible"
                @success="handleCaptchaSuccess"
                @close="handleCaptchaClose"
            />
        </a-card>
    </div>


</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Form, Input, Button, Card, message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import type { UnwrapRef } from 'vue';
import type { FormProps } from 'ant-design-vue';
import type { UserLoginData } from '@/types/main';
import { issueCaptchaToken, login as loginApi } from '@/api/user/user';
import { useRouter } from 'vue-router';
import { AuthService } from '@/service/auth.service';
import { isNull } from '@/utils/verification';
import Vcode from 'vue3-puzzle-vcode';

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
const handleFinishFailed: FormProps['onFinishFailed'] = (_errors) => {
};

const captchaVisible = ref(false);
const loginLoading = ref(false);
const pendingLoginData = ref<UserLoginData | null>(null);

const validateBeforeCaptcha = (): boolean => {
    const data = {
        username: formState.user,
        password: formState.password,
    };
    const requireArray: { key: keyof typeof data; message: string }[] = [
        {
            key: 'username',
            message: '用户名不能为空',
        },
        {
            key: 'password',
            message: '密码不能为空',
        },
    ];

    for (const item of requireArray) {
        if (isNull(data[item.key])) {
            message.warn(item.message);
            return false;
        }
    }
    return true;
};

const handleLogin: FormProps['onFinish'] = async () => {
    if (!validateBeforeCaptcha()) {
        return;
    }

    pendingLoginData.value = {
        username: formState.user,
        password: formState.password,
        captcha_token: '',
    };
    captchaVisible.value = true;
};

const handleCaptchaSuccess = async () => {
    if (!pendingLoginData.value || loginLoading.value) {
        return;
    }

    captchaVisible.value = false;
    loginLoading.value = true;
    try {
        const captchaRes = await issueCaptchaToken(pendingLoginData.value.username);
        const captchaToken = captchaRes.data?.captcha_token || '';
        if (isNull(captchaToken)) {
            message.error('验证码凭证获取失败，请重试');
            return;
        }

        const res = await loginApi({
            ...pendingLoginData.value,
            captcha_token: captchaToken,
        });
        if (res.code === 200) {
            AuthService.setToken(res.data?.token || '');
            router.push({ path: '/' });
        }
    } finally {
        loginLoading.value = false;
        pendingLoginData.value = null;
    }
};

const handleCaptchaClose = () => {
    captchaVisible.value = false;
    pendingLoginData.value = null;
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
