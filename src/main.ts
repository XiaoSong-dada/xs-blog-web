import { createApp } from 'vue'
import App from './App.vue'
import router from './router/main.ts'
import { createPinia } from 'pinia'
import './style/layout.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia).use(router).mount('#app')
