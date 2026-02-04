import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// Setup Pinia
const pinia = createPinia()
app.use(pinia)

// Setup Router
app.use(router)

app.mount('#app')
