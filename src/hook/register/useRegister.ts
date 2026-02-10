import { sendRegisterCode as send, registerUser as register } from '@/api/user/user';
import type { IRegister } from "@/types/main"
import { isEmail, isNull } from '@/utils/verification';
import { message } from 'ant-design-vue';
import { ref } from "vue"
import { useRouter } from 'vue-router';

export const useRegister = () => {
    const router = useRouter();
    const user = ref<IRegister>({
        username: '',
        password: '',
        email: '',
        nick_name: '',
        code: '',
    })
    const isSending = ref(false);
    const labelCountdown = ref(60);
    const labelTimer = ref<number | null>(null);
    const sendLable = ref('发送验证码');

    const sendRegisterCode = async () => {
        if (user.value.email === '') {
            return message.warn('请输入邮箱地址');
        }

        isSending.value = true;
        try {
            const res = await send(user.value.email);
            if (res.code !== 200) {
                throw new Error(res.message || '发送失败');
            }

            message.success('验证码已发送，请查收您的邮箱');

            labelTimer.value = window.setInterval(() => {
                if (labelCountdown.value > 0) {
                    sendLable.value = `重新发送(${labelCountdown.value}s)`;
                    labelCountdown.value--;
                } else {
                    window.clearInterval(labelTimer.value!);
                    sendLable.value = '发送验证码';
                    labelCountdown.value = 60;
                }
            }, 1000);


        } catch (error) {

        } finally {
            isSending.value = false;
        }
    }

    const registerUser = async () => {
        let check = true;
        ['username', 'password', 'email', 'nick_name', 'code'].forEach(key => {
            if (isNull(user.value[key as keyof IRegister])) {
                message.warn(`请输入${key.replace('_', ' ')}`);
                check = false;
            }
        });

        if (isEmail(user.value.email) === false) {
            message.warn('邮箱格式不正确');
            return;
        }

        if (!check) return;
        register(user.value).then(res => {
            if (res.code == 201) {
                message.success('注册成功');
                router.push({ path: '/login' });
            }
        })
    }


    return {
        user,
        isSending,
        sendLable,
        labelCountdown,
        sendRegisterCode,
        registerUser
    }
}


