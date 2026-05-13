<template>
  <div class="ai-chat-page">
    <a-row :gutter="16" class="ai-chat-row">
      <a-col :span="16" class="ai-chat-left">
        <a-card title="AI 助手" class="chat-card">
          <div class="chat-messages" ref="messagesContainer">
            <div
              v-for="(msg, i) in chatMessages"
              :key="i"
              :class="['message-item', msg.role === 'user' ? 'message-user' : 'message-assistant']"
            >
              <a-avatar v-if="msg.role === 'assistant'" class="avatar-ai">AI</a-avatar>
              <div class="message-bubble">{{ msg.content }}</div>
              <a-avatar v-if="msg.role === 'user'" class="avatar-user">U</a-avatar>
            </div>
            <div v-if="loading" class="message-item message-assistant">
              <a-avatar class="avatar-ai">AI</a-avatar>
              <div class="message-bubble"><a-spin size="small" /> 思考中...</div>
            </div>
          </div>
          <div class="chat-input">
            <a-input
              v-model:value="inputMessage"
              placeholder="输入消息..."
              @pressEnter="sendMessage"
              :disabled="loading"
            />
            <a-button type="primary" @click="sendMessage" :loading="loading" class="send-btn">
              发送
            </a-button>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8" class="ai-chat-right">
        <a-card title="用户权限信息" class="info-card" size="small">
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="角色">
              {{ userInfo?.is_admin ? '管理员' : '普通用户' }}
            </a-descriptions-item>
            <a-descriptions-item label="用户名">
              {{ userInfo?.username }}
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <h4 class="func-title">可调用功能</h4>
          <a-list :data-source="availableFunctions" size="small">
            <template #renderItem="{ item }">
              <a-list-item>{{ item }}</a-list-item>
            </template>
          </a-list>
        </a-card>
        <a-card title="DeepSeek 配置" class="config-card" size="small">
          <a-form layout="vertical" :model="configForm">
            <a-form-item label="API Key">
              <a-input-password v-model:value="configForm.api_key" placeholder="sk-..." />
            </a-form-item>
            <a-form-item label="Base URL">
              <a-input v-model:value="configForm.base_url" placeholder="https://api.deepseek.com" />
              <div class="form-hint">OpenAI API 兼容格式</div>
            </a-form-item>
            <a-form-item label="Model">
              <a-select v-model:value="configForm.model" :options="modelOptions" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" block @click="applyConfig">应用</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed } from 'vue';
import {
  message,
  Row,
  Col,
  Card,
  Spin,
  Button,
  Input,
  InputPassword,
  Form,
  Avatar,
  Descriptions,
  Divider,
  List,
  Select,
} from 'ant-design-vue';
import { getUserInfo } from '@/api/user/user';
import { sendChatMessage } from '@/api/ai/chat';
import type { ChatMessage as ChatMsg, DeepSeekConfig } from '@/types/main';
import type { IUserCell } from '@/types/main';

const ARow = Row;
const ACol = Col;
const ACard = Card;
const ASpin = Spin;
const AButton = Button;
const AInput = Input;
const AInputPassword = InputPassword;
const AForm = Form;
const AFormItem = Form.Item;
const AAvatar = Avatar;
const ADescriptions = Descriptions;
const ADescriptionsItem = Descriptions.Item;
const ADivider = Divider;
const AList = List;
const AListItem = List.Item;
const ASelect = Select;

const inputMessage = ref('');
const loading = ref(false);
const chatMessages = reactive<ChatMsg[]>([]);
const messagesContainer = ref<HTMLElement | null>(null);
const userInfo = ref<IUserCell | null>(null);

const configForm = reactive<DeepSeekConfig>({
  api_key: '',
  base_url: 'https://api.deepseek.com',
  model: 'deepseek-v4-flash',
});

const modelOptions = [
  { value: 'deepseek-v4-flash', label: 'deepseek-v4-flash（快速，推荐）' },
  { value: 'deepseek-v4-pro', label: 'deepseek-v4-pro（强力推理）' }
];

const availableFunctions = computed<string[]>(() => {
  if (userInfo.value?.is_admin) {
    return ['update_user_info（更新个人信息）', '更多功能开发中...'];
  }
  return ['update_user_info（更新个人信息）'];
});

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  const text = inputMessage.value.trim();
  if (!text) return;

  if (!configForm.api_key) {
    message.warning('请先在右侧配置 DeepSeek API Key');
    return;
  }

  chatMessages.push({ role: 'user', content: text });
  inputMessage.value = '';
  await scrollToBottom();

  loading.value = true;
  try {
    const res = await sendChatMessage({
      messages: [...chatMessages],
      config: { ...configForm },
    });
    if (res.data?.reply) {
      chatMessages.push({ role: 'assistant', content: res.data.reply });
    }
    await scrollToBottom();
  } catch {
    chatMessages.push({ role: 'assistant', content: '抱歉，请求失败，请稍后重试。' });
    await scrollToBottom();
  } finally {
    loading.value = false;
  }
};

const applyConfig = () => {
  localStorage.setItem('ai_deepseek_config', JSON.stringify(configForm));
  message.success('配置已保存');
};

const loadConfig = () => {
  try {
    const raw = localStorage.getItem('ai_deepseek_config');
    if (raw) {
      const parsed = JSON.parse(raw) as DeepSeekConfig;
      if (parsed.api_key !== undefined) configForm.api_key = parsed.api_key;
      if (parsed.base_url !== undefined) configForm.base_url = parsed.base_url;
      if (parsed.model !== undefined) configForm.model = parsed.model;
    }
  } catch {
    // ignore parse errors
  }
};

onMounted(async () => {
  loadConfig();
  try {
    const res = await getUserInfo();
    if (res.data) {
      userInfo.value = res.data;
    }
  } catch {
    // silently ignore
  }
});
</script>

<style scoped lang="scss">
.ai-chat-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ai-chat-row {
  flex: 1;
  min-height: 0;
}

.ai-chat-left {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ai-chat-right {
  height: 100%;
  overflow-y: auto;
}

.chat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.ant-card-body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  padding: 0 8px;
}

.message-user {
  flex-direction: row-reverse;
}

.message-assistant {
  flex-direction: row;
}

.avatar-ai {
  flex-shrink: 0;
  background-color: #87d068;
}

.avatar-user {
  flex-shrink: 0;
  background-color: #1890ff;
}

.message-bubble {
  max-width: 70%;
  padding: 10px 16px;
  border-radius: 12px;
  word-break: break-word;
  line-height: 1.6;
}

.message-user .message-bubble {
  background-color: #1890ff;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.message-assistant .message-bubble {
  background-color: #f0f0f0;
  color: #333;
  border-bottom-left-radius: 4px;
}

.chat-input {
  display: flex;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
}

.send-btn {
  margin-left: 8px;
}

.info-card {
  margin-bottom: 16px;
}

.config-card {
  margin-bottom: 0;
}

.func-title {
  margin: 8px 0;
}

.form-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>
