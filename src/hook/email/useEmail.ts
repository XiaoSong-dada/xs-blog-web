import { ref } from "vue";
import { sendEmailCode } from "@/api/email/email";
import { message } from "ant-design-vue";

export const useSendEmail = () => {
    const isSending = ref(false);
    const labelCountdown = ref(60);
    const labelTimer = ref<number | null>(null);
    const sendLable = ref('发送验证码');
    const sendCode = async (email:string) => {


        isSending.value = true;
        try {
            const res = await sendEmailCode(email);
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
    return {
        isSending,
        labelCountdown,
        sendLable,
        sendCode
    }

}