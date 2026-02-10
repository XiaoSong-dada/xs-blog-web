<template>
    <security-list class="security-list" @action="listAction" />

    <a-modal v-model:open="modalVisible" title="修改密码" ok-text="确认修改" cancel-text="取消" @ok="updatePassword"
        @cancel="resetPassword">
        <input type="text" :value="userInfo?.username" autocomplete="username" aria-hidden="true" tabindex="-1"
            style="position:absolute; left:-9999px; width:1px; height:1px;" />
        <a-form layout="vertical">
            <a-form-item label="旧密码">
                <a-input-password v-model:value="passwordUser.old_password" placeholder="请输入旧密码"
                    autocomplete="current-password" />
            </a-form-item>
            <a-form-item label="新密码">
                <a-input-password v-model:value="passwordUser.password" placeholder="请输入新密码"
                    autocomplete="new-password" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import securityList from '@/components/me/security.list.vue';
import { useUpdatePassword } from '@/hook/user/useUser';
import { AuthService } from '@/service/auth.service';
import type { IUserInfo } from '@/types/main';
import { Modal, Form, InputPassword } from 'ant-design-vue';
import { onMounted, ref } from 'vue';

const userInfo = ref<IUserInfo>();
const { updatePassword, passwordUser, modalVisible, resetPassword } = useUpdatePassword();
const AModal = Modal;
const AForm = Form;
const AFormItem = Form.Item;
const AInputPassword = InputPassword;
const listAction = (action: string) => {
    if (action === 'changePassword') {
        modalVisible.value = true;
    }
}

onMounted(async () => {
    const user_info = await AuthService.getUserInfo()
    if (user_info) userInfo.value = user_info;
});
</script>

<style scoped lang="scss">
.security-list {}
</style>