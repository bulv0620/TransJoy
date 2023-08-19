import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import Router from './router/index'
import naive from 'naive-ui'
// 通用字体
import 'vfonts/Lato.css'

const app = createApp(App)
app.config.productionTip = false

app.use(naive)

app.use(Router)
app.mount('#app')
