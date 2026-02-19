<template>
    <div class="me-base flex-start gap-64">
        <a-form class="form" :model="user" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
            @submit="submit" autocomplete="off" layout="vertical" labelWrap>
            <a-form-item label="邮箱" name="email">
                <a-input v-model:value="user.email" />
            </a-form-item>
            <a-form-item label="验证码" name="code">
                <a-input-search v-model:value="user.code" placeholder="验证码">
                    <template #enterButton>
                        <a-button @click="send" :disabled="isSending">{{ sendLable }}</a-button>
                    </template>
                </a-input-search>
            </a-form-item>
            <a-form-item label="昵称" name="nick_name">
                <a-input v-model:value="user.nick_name" />
            </a-form-item>

            <a-form-item>
                <a-button type="primary" html-type="submit">更改基本信息</a-button>
            </a-form-item>
        </a-form>
        <div class="flex-start flex-column">
            头像
            <div class="convert-img">
                <a-image :width="200" class="img" :src="computUrl" />
            </div>
            <a-upload v-model:file-list="fileList" name="file" :before-upload="beforeUpload" :maxCount="1">
                <a-button>
                    <upload-outlined></upload-outlined>
                    更换头像
                </a-button>
            </a-upload>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { Form, Input, Button, Image, Upload, type UploadFile, message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { useUser } from '@/hook/user/useUser';
import { useUplaodImgFile } from '@/hook/file/useUpload';
import { config } from '@/config/local.env';
import { useSendEmail } from '@/hook/email/useEmail';
const AForm = Form;
const AFormItem = Form.Item;
const AInput = Input;
const AInputSearch = Input.Search;
const AImage = Image;
const AUpload = Upload;
const AButton = Button;

const { user, getOwnerInfo, updateUser,_userInfo } = useUser();
const { uploadFile } = useUplaodImgFile();
const { sendCode, sendLable, isSending } = useSendEmail();

const fileList = reactive<UploadFile[]>([]);

const beforeUpload = async (file: File) => {
    const res = await uploadFile(file)
    user.value.avatar_url = res.data?.stored_path ?? ''
    return false;
}

const submit = () => {
    updateUser()
}

const send = () =>{
    if(!user.value.email) {
        message.warn('请先输入邮箱')
        return
    }
    console.log(user.value);
    

    if(_userInfo.value?.email === user.value.email) {
        message.warn('邮箱未修改，无需发送验证码')
        return
    }

    sendCode(user.value.email)
}

onMounted(() => {
    getOwnerInfo();
})

const computUrl = computed(() => {
    return config.VITE_STATIC_URL + user.value.avatar_url
})

</script>

<style scoped lang="scss">
.me-base {
    width: 100%;

    .form {
        width: 400px;
    }

    .img {
        border-radius: 50px;
    }

    .convert-img {
        width: 200px;
        height: 200px;
        overflow: hidden;
        border-radius: 50%;
    }
}
</style>