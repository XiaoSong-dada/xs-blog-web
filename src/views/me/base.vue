<template>
    <div class="me-base flex-start gap-64">
        <a-form class="form" :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
            autocomplete="off" layout="vertical" labelWrap>
            <a-form-item label="邮箱" name="email">
                <a-input v-model:value="formState.email" />
            </a-form-item>

            <a-form-item label="昵称" name="nick_name">
                <a-input v-model:value="formState.nick_name" />
            </a-form-item>

            <a-form-item>
                <a-button type="primary" html-type="submit">更改基本信息</a-button>
            </a-form-item>
        </a-form>
        <div class="flex-start flex-column gap-20">
            头像
            <a-image :width="200" class="img"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
            <a-upload v-model:file-list="fileList" name="file"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76">
                <a-button>
                    <upload-outlined></upload-outlined>
                    更换头像
                </a-button>
            </a-upload>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Form, Input, Button, Image, Upload, type UploadFile } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
const AForm = Form;
const AFormItem = Form.Item;
const AInput = Input;
const AImage = Image;
const AUpload = Upload;
const AButton = Button;
interface FormState {
    email: string;
    nick_name: string;
}

const formState = reactive<FormState>({
    email: '',
    nick_name: '',
});

const fileList = reactive<UploadFile[]>([]);
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
}
</style>