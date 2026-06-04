import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { BRAND_FAVICON_SRC } from '@/constants/brand-assets'

function setFavicon(href: string) {
  const type = href.includes('.svg') ? 'image/svg+xml' : 'image/jpeg'
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.type = type
  link.href = href
}

setFavicon(BRAND_FAVICON_SRC)

const app = createApp(App)

// Setup Pinia
const pinia = createPinia()
app.use(pinia)

// Setup Router
app.use(router)

app.mount('#app')
